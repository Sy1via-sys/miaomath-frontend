import { useState, useCallback } from "react";
import Header from "./components/Header";
import MainLayout from "./components/MainLayout";
import InputPanel from "./components/InputPanel/InputPanel";
import GraphPanel from "./components/GraphPanel/GraphPanel";
import AnalysisPanel from "./components/AnalysisPanel/AnalysisPanel";
import ErrorToast from "./components/ErrorToast";
import { useOcr } from "./hooks/useOcr";
import { useAnalysis } from "./hooks/useAnalysis";
import { useGeoGebra } from "./hooks/useGeoGebra";
import { fileToBase64 } from "./api/client";
import "./App.css";

export default function App() {
  const [imageFile, setImageFile] = useState(null);
  const [latex, setLatex] = useState("");
  const [derivativeOrder, setDerivativeOrder] = useState(2);
  const [globalError, setGlobalError] = useState(null);

  const ocr = useOcr();
  const analysis = useAnalysis();
  const geogebra = useGeoGebra();

  const handleUpload = useCallback(
    async (file) => {
      setImageFile(file);
      setLatex("");
      setGlobalError(null);

      try {
        const base64 = await fileToBase64(file);
        const ocrResult = await ocr.recognize(base64);
        if (ocrResult.success) {
          setLatex(ocrResult.latex);
        } else {
          setGlobalError(ocrResult.error);
        }
      } catch (err) {
        setGlobalError("上传或识别失败，请重试");
      }
    },
    [ocr],
  );

  const handleAnalyze = useCallback(async () => {
    if (!latex.trim()) return;
    setGlobalError(null);

    const [analysisResult] = await Promise.all([
      analysis.analyze(latex, derivativeOrder),
      geogebra.generate(latex, derivativeOrder),
    ]);

    if (!analysisResult.success) {
      setGlobalError(analysisResult.error || "分析失败");
    }
    if (geogebra.commands.length === 0 && geogebra.error) {
      setGlobalError(geogebra.error);
    }
  }, [latex, derivativeOrder, analysis, geogebra]);

  return (
    <div className="app">
      <Header />
      <MainLayout
        left={
          <InputPanel
            onUpload={handleUpload}
            latex={latex}
            onLatexChange={setLatex}
            derivativeOrder={derivativeOrder}
            onOrderChange={setDerivativeOrder}
            ocrLoading={ocr.loading}
            ocrError={ocr.error}
            analyzeLoading={analysis.loading || geogebra.loading}
            onAnalyze={handleAnalyze}
          />
        }
        center={<GraphPanel commands={geogebra.commands} />}
        right={
          <AnalysisPanel
            result={analysis.result}
            loading={analysis.loading}
            error={analysis.error}
          />
        }
      />
      <ErrorToast message={globalError} onClose={() => setGlobalError(null)} />
    </div>
  );
}
