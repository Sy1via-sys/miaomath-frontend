import { useState, useCallback } from "react";
import Header from "./components/Header";
import MainLayout from "./components/MainLayout";
import InputPanel from "./components/InputPanel/InputPanel";
import GraphPanel from "./components/GraphPanel/GraphPanel";
import AnalysisPanel from "./components/AnalysisPanel/AnalysisPanel";
import ErrorToast from "./components/ErrorToast";
import SettingsModal from "./components/SettingsModal";
import { useOcr } from "./hooks/useOcr";
import { useAnalysis } from "./hooks/useAnalysis";
import { useGeoGebra } from "./hooks/useGeoGebra";
import { useRecognize } from "./hooks/useRecognize";
import { useSettings } from "./hooks/useSettings";
import { fileToBase64, exportGraph } from "./api/client";
import "./App.css";

export default function App() {
  const [latex, setLatex] = useState("");
  const [derivativeOrder, setDerivativeOrder] = useState(2);
  const [globalError, setGlobalError] = useState(null);
  const [problemType, setProblemType] = useState("");
  const [expressions, setExpressions] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  const { settings, saveSettings, hasSettings } = useSettings();
  const ocr = useOcr();
  const analysis = useAnalysis();
  const geogebra = useGeoGebra();
  const recognize = useRecognize();

  const isGeometry = problemType && problemType !== "function";

  const handleUpload = useCallback(async (file) => {
    setLatex("");
    setProblemType("");
    setExpressions([]);
    setGlobalError(null);

    try {
      const base64 = await fileToBase64(file);

      if (hasSettings) {
        const result = await recognize.recognize(base64, settings.endpoint, settings.apiKey, settings.model);
        if (result.success) {
          setProblemType(result.type);
          setExpressions(result.expressions);
          if (result.latex) setLatex(result.latex);
          return;
        }
        setGlobalError(result.error);
      }

      // Fallback to Mathpix
      const ocrResult = await ocr.recognize(base64);
      if (ocrResult.success) {
        setLatex(ocrResult.latex);
      } else {
        setGlobalError(ocrResult.error || "识别失败，请手动输入表达式");
      }
    } catch (err) {
      setGlobalError("上传或识别失败，请重试");
    }
  }, [hasSettings, settings, recognize, ocr]);

  const handleAnalyze = useCallback(async () => {
    if (!latex.trim()) return;
    setGlobalError(null);

    const [analysisResult] = await Promise.all([
      analysis.analyze(latex, derivativeOrder),
      geogebra.generate(latex, derivativeOrder, problemType || "function", []),
    ]);

    if (!analysisResult.success) {
      setGlobalError(analysisResult.error || "分析失败");
    }
  }, [latex, derivativeOrder, analysis, geogebra, problemType]);

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

  return (
    <div className="app">
      <Header onOpenSettings={() => setShowSettings(true)} />
      <MainLayout
        left={
          <InputPanel
            onUpload={handleUpload}
            latex={latex}
            onLatexChange={setLatex}
            derivativeOrder={derivativeOrder}
            onOrderChange={setDerivativeOrder}
            ocrLoading={ocr.loading || recognize.loading}
            ocrError={ocr.error || recognize.error}
            analyzeLoading={analysis.loading || geogebra.loading}
            onAnalyze={handleAnalyze}
            problemType={problemType}
            expressions={expressions}
            onExport={handleExport}
            isGeometry={isGeometry}
          />
        }
        center={
          <GraphPanel
            commands={geogebra.commands}
            isGeometry={isGeometry}
          />
        }
        right={
          <AnalysisPanel
            result={analysis.result}
            loading={analysis.loading}
            error={analysis.error}
          />
        }
      />
      <ErrorToast message={globalError} onClose={() => setGlobalError(null)} />
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={saveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
