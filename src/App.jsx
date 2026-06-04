import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Header from "./components/Header";
import MainLayout from "./components/MainLayout";
import InputPanel from "./components/InputPanel/InputPanel";
import GraphPanel from "./components/GraphPanel/GraphPanel";
import AnalysisPanel from "./components/AnalysisPanel/AnalysisPanel";
import ErrorToast from "./components/ErrorToast";
import ParticleBackground from "./components/ParticleBackground";
import TiltCard from "./components/TiltCard";
import AuthPage from "./components/AuthPage";
import HistoryModal from "./components/HistoryModal";
import { useAnalysis } from "./hooks/useAnalysis";
import { useGeoGebra } from "./hooks/useGeoGebra";
import { useRecognize } from "./hooks/useRecognize";
import { useSettings } from "./hooks/useSettings";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { fileToBase64, exportGraph, getSolution } from "./api/client";
import API_BASE from "./api/config";
import "./App.css";

function AppContent() {
  const { user, loading, isGuest, doLogout, getToken } = useAuth();
  const [latex, setLatex] = useState("");
  const [derivativeOrder, setDerivativeOrder] = useState(2);
  const [globalError, setGlobalError] = useState(null);
  const [problemType, setProblemType] = useState("");
  const [expressions, setExpressions] = useState([]);
  const [solution, setSolution] = useState([]);
  const [graphSpec, setGraphSpec] = useState(null);
  const [geometryElements, setGeometryElements] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const { settings } = useSettings();
  const analysis = useAnalysis();
  const geogebra = useGeoGebra();
  const recognize = useRecognize();

  const isGeometry = problemType && problemType !== "function";
  const lastSavedRef = useRef(null);

  const currentStep = useMemo(() => {
    if (solution.length > 0) return 3;
    if (geogebra.commands.length > 0 || analysis.result) return 2;
    if (latex.trim()) return 1;
    return 0;
  }, [solution.length, geogebra.commands.length, analysis.result, latex]);

  const handleReset = useCallback(() => {
    setLatex("");
    setDerivativeOrder(2);
    setGlobalError(null);
    setProblemType("");
    setExpressions([]);
    setSolution([]);
    setGraphSpec(null);
    setGeometryElements([]);
    lastSavedRef.current = null;
  }, []);

  const handleExample = useCallback(async (example) => {
    setLatex(example.latex);
    setProblemType(example.type);
    setExpressions([example.latex]);
    setSolution([]);
    setGraphSpec(null);
    setGeometryElements([]);
    setGlobalError(null);

    const order = 2;
    const [analysisResult, geogebraResult] = await Promise.all([
      analysis.analyze(example.latex, order),
      geogebra.generate(example.latex, order, example.type, [], null),
    ]);

    if (analysisResult && !analysisResult.success) {
      setGlobalError(analysisResult.error || "分析失败");
    }
    if (!geogebraResult.success) {
      setGlobalError(geogebraResult.error || "图像生成失败");
    }
  }, [analysis, geogebra]);

  const handleApplyGeometry = useCallback(async () => {
    setGlobalError(null);
    const result = await geogebra.generate("", 2, "geometry", geometryElements, graphSpec);
    if (!result.success) {
      setGlobalError(result.error || "几何图像生成失败");
    }
  }, [geometryElements, geogebra, graphSpec]);

  const handleUpload = useCallback(async (file) => {
    setLatex("");
    setProblemType("");
    setExpressions([]);
    setSolution([]);
    setGraphSpec(null);
    setGlobalError(null);

    try {
      const { base64, mime } = await fileToBase64(file);

      // AI recognition (two-stage: Qwen vision → text → DeepSeek → structured JSON)
      const result = await recognize.recognize(base64, settings.model, mime);

      if (result.success && (result.latex || result.graph_spec)) {
        setProblemType(result.type);
        setExpressions(result.expressions);
        if (result.graph_spec) setGraphSpec(result.graph_spec);
        if (result.latex) setLatex(result.latex);

        // Fire solution generation in background (non-blocking)
        if (result.latex) {
          getSolution(
            result.type, result.expressions, result.latex,
            settings.solutionModel, result.graph_spec
          ).then(solResult => {
            if (solResult.success) setSolution(solResult.solution || []);
          }).catch(e => console.log("Solution fetch failed:", e));
        }

        // Auto-trigger analysis + GeoGebra graph generation
        const graphType = result.type || (result.graph_spec?.graph_type || "function");
        const hasLatex = (result.latex || "").trim().length > 0;
        const [analysisResult, geogebraResult] = await Promise.all([
          hasLatex ? analysis.analyze(result.latex, derivativeOrder) : Promise.resolve({ success: true }),
          geogebra.generate(result.latex || "", derivativeOrder, graphType, [], result.graph_spec || null),
        ]);
        if (analysisResult && !analysisResult.success) {
          setGlobalError(analysisResult.error || "分析失败");
        }
        if (!geogebraResult.success) {
          setGlobalError(geogebraResult.error || "图像生成失败");
        }
        return;
      }

      // AI recognition failed — no OCR fallback
      setGlobalError(result.error || "AI 识别失败，请尝试更清晰的图片或手动输入表达式");
    } catch (err) {
      setGlobalError("上传或识别失败，请重试");
    }
  }, [settings, recognize, analysis, geogebra, derivativeOrder]);

  const saveHistory = useCallback(async () => {
    if (isGuest) return;
    const token = getToken();
    if (!token || !latex.trim()) return;

    // Avoid duplicate saves for the same analysis
    const saveKey = latex + JSON.stringify(analysis.result);
    if (lastSavedRef.current === saveKey) return;
    lastSavedRef.current = saveKey;

    const title = problemType
      ? `${problemType === "function" ? "函数" : problemType === "analytic_geometry" ? "解析几何" : problemType === "plane_geometry" ? "平面几何" : "立体几何"} - ${latex.slice(0, 40)}`
      : latex.slice(0, 50);

    await fetch(`${API_BASE}/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        problem_type: problemType,
        latex,
        expressions,
        graph_spec: graphSpec,
        analysis_result: analysis.result,
        geogebra_commands: geogebra.commands,
        solution_steps: solution,
        title,
      }),
    });
  }, [latex, problemType, expressions, graphSpec, analysis.result, geogebra.commands, solution, getToken, isGuest]);

  // Auto-save when analysis + graph complete
  useEffect(() => {
    if (analysis.result?.success && geogebra.commands.length > 0 && latex.trim()) {
      saveHistory();
    }
  }, [analysis.result, geogebra.commands, latex, saveHistory]);

  const handleAnalyze = useCallback(async () => {
    setGlobalError(null);

    const hasLatex = latex.trim().length > 0;
    const tasks = [];

    if (hasLatex) {
      tasks.push(analysis.analyze(latex, derivativeOrder));
    } else {
      tasks.push(Promise.resolve({ success: true }));
    }
    const graphType = problemType || (geometryElements.length > 0 ? "geometry" : "function");
    tasks.push(geogebra.generate(latex, derivativeOrder, graphType, geometryElements, graphSpec));

    const [analysisResult, geogebraResult] = await Promise.all(tasks);

    if (analysisResult && !analysisResult.success) {
      setGlobalError(analysisResult.error || "分析失败");
    }
    if (!geogebraResult.success) {
      setGlobalError(geogebraResult.error || "图像生成失败");
    }
  }, [latex, derivativeOrder, analysis, geogebra, problemType, geometryElements, graphSpec]);

  const handleExport = useCallback(async (format) => {
    if (geogebra.commands.length === 0) {
      setGlobalError("请先分析后再导出");
      return;
    }
    try {
      if (format === "link") {
        const base64 = btoa(JSON.stringify(geogebra.commands));
        await navigator.clipboard.writeText(`${window.location.origin}?g=${base64}`);
        setGlobalError(null);
        alert("链接已复制到剪贴板");
      } else if (format === "png") {
        setGlobalError("PNG 导出请使用 GeoGebra 画布自带的截图功能");
      } else {
        const blob = await exportGraph(geogebra.commands, format);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = format === "html" ? "math-graph.html" : "math-graph.ggb";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setGlobalError("导出失败，请重试");
    }
  }, [geogebra.commands]);

  const handleRecall = useCallback((record) => {
    setLatex(record.latex || "");
    setProblemType(record.problem_type || "");
    setExpressions(record.expressions || []);
    setSolution(record.solution_steps || []);
    setGraphSpec(record.graph_spec || null);
    setGeometryElements([]);
    setGlobalError(null);
  }, []);

  // Auth loading state
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #f0f4ff 0%, #f8fafc 50%, #eff6ff 100%)",
        fontSize: 16, color: "#94a3b8",
      }}>
        加载中...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="app">
      <ParticleBackground />

      <Header
        currentStep={currentStep}
        onExample={handleExample}
        onReset={handleReset}
        user={user}
        isGuest={isGuest}
        onLogout={doLogout}
        onHistory={() => setShowHistory(true)}
      />
      <MainLayout
        left={
          <InputPanel
            onUpload={handleUpload}
            latex={latex}
            onLatexChange={setLatex}
            derivativeOrder={derivativeOrder}
            onOrderChange={setDerivativeOrder}
            ocrLoading={recognize.loading}
            ocrError={recognize.error}
            analyzeLoading={analysis.loading || geogebra.loading}
            onAnalyze={handleAnalyze}
            onApplyGeometry={handleApplyGeometry}
            problemType={problemType}
            expressions={expressions}
            onExport={handleExport}
            isGeometry={isGeometry}
            geometryElements={geometryElements}
            onGeometryChange={setGeometryElements}
          />
        }
        center={
          <TiltCard style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <GraphPanel
              commands={geogebra.commands}
              isGeometry={isGeometry}
              problemType={problemType}
            />
          </TiltCard>
        }
        right={
          <TiltCard style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <AnalysisPanel
              result={analysis.result}
              loading={analysis.loading}
              error={analysis.error}
              solution={solution}
            />
          </TiltCard>
        }
      />
      <ErrorToast message={globalError} onClose={() => setGlobalError(null)} />

      {showHistory && (
        <HistoryModal
          onClose={() => setShowHistory(false)}
          onRecall={handleRecall}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
