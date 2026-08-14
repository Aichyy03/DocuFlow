import { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle2, Clock, Activity } from 'lucide-react';

export default function App() {
  const [file, setFile] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setResult(null);
    setTaskStatus('Ingesting document into queue...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/ingest', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const currentTaskId = response.data.task_id;
      setTaskId(currentTaskId);
      pollTaskStatus(currentTaskId);
    } catch (error) {
      console.error('Upload error:', error);
      setTaskStatus('Failed to ingest document');
      setIsProcessing(false);
    }
  };

  const pollTaskStatus = (id) => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/tasks/${id}`);
        const data = res.data;

        if (data.state === 'SUCCESS') {
          clearInterval(interval);
          setResult(data.result);
          setIsProcessing(false);
          setTaskStatus('COMPLETED');
        } else if (data.state === 'PROGRESS') {
          setTaskStatus(data.status || 'Processing...');
        }
      } catch (error) {
        console.error('Polling error:', error);
        clearInterval(interval);
        setIsProcessing(false);
        setTaskStatus('Error polling task');
      }
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f3f4f6', fontFamily: 'system-ui, sans-serif', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ marginBottom: '2.5rem', borderBottom: '1px solid #1f293d', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ backgroundColor: '#2563eb', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
                <Activity size={24} color="#fff" />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em' }}>DocuFlow Pipeline</h1>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#9ca3af' }}>Distributed Asynchronous Ingestion & Extraction Engine</p>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', backgroundColor: '#1e293b', border: '1px solid #334155', padding: '4px 10px', borderRadius: '9999px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ● Celery & Redis Connected
            </span>
          </div>
        </header>

        {/* Ingestion Area */}
        <section style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={20} color="#38bdf8" /> Upload Document to Queue
          </h2>
          
          <div style={{ border: '2px dashed #374151', borderRadius: '8px', padding: '2rem 1rem', textAlign: 'center', backgroundColor: '#0b1120' }}>
            <input type="file" onChange={handleFileChange} id="fileInput" style={{ display: 'none' }} />
            <label htmlFor="fileInput" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={40} color="#60a5fa" />
              <span style={{ fontWeight: 500 }}>{file ? file.name : "Click to select a text/data file (.txt, .json, .csv)"}</span>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Files are parsed asynchronously via Celery workers</span>
            </label>
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || isProcessing}
            style={{
              marginTop: '1.25rem',
              width: '100%',
              backgroundColor: !file || isProcessing ? '#374151' : '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem',
              fontWeight: 600,
              cursor: !file || isProcessing ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {isProcessing ? 'Processing in Queue...' : 'Dispatch to Ingestion Pipeline'}
          </button>
        </section>

        {/* Task Tracking & Results */}
        {(taskId || result) && (
          <section style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: 0, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="#38bdf8" /> Execution Metrics & Status
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: '#1f2937', padding: '1rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block' }}>TASK ID</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, fontFamily: 'monospace' }}>{taskId || 'N/A'}</span>
              </div>
              <div style={{ backgroundColor: '#1f2937', padding: '1rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block' }}>STATUS</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: taskStatus === 'COMPLETED' ? '#4ade80' : '#38bdf8' }}>
                  {taskStatus}
                </span>
              </div>
            </div>

            {result && (
              <div style={{ backgroundColor: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', marginBottom: '0.75rem', fontWeight: 600 }}>
                  <CheckCircle2 size={18} /> Processing Pipeline Completed Successfully
                </div>
                <pre style={{ margin: 0, color: '#93c5fd', fontSize: '0.875rem', fontFamily: 'monospace', overflowX: 'auto' }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
}