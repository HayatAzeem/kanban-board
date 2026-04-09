import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import { Sparkles, X, Copy, Check } from "lucide-react";

interface ApplicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationToEdit: any | null;
  onSave: () => void;
  onDelete?: (id: string) => void;
}

export const ApplicationFormModal = ({ isOpen, onClose, applicationToEdit, onSave, onDelete }: ApplicationFormModalProps) => {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    jdLink: "",
    notes: "",
    salaryRange: "",
    status: "Applied",
  });
  const [parsing, setParsing] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeSuggestions, setResumeSuggestions] = useState<string[]>([]);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (applicationToEdit) {
      setFormData(applicationToEdit);
      setJobDescription("");
      setResumeSuggestions([]);
    } else {
      setFormData({
        company: "",
        role: "",
        jdLink: "",
        notes: "",
        salaryRange: "",
        status: "Applied",
      });
      setJobDescription("");
      setResumeSuggestions([]);
    }
    setError("");
  }, [applicationToEdit, isOpen]);

  const handleParseOption = async () => {
    if (!jobDescription) return;
    setParsing(true);
    setError("");
    try {
      const { data } = await apiClient.post("/applications/parse", { jobDescription });
      setFormData((prev) => ({
        ...prev,
        company: data.company || prev.company,
        role: data.role || prev.role,
      }));
      await fetchSuggestions();
    } catch (err: any) {
      setError("Failed to parse JD or format is unsupported");
    } finally {
      setParsing(false);
    }
  };

  const fetchSuggestions = async () => {
    setGeneratingSuggestions(true);
    try {
      const { data } = await apiClient.post("/applications/suggestions", {
        jobDescription,
        role: formData.role || "this role",
        company: formData.company || "this company"
      });
      setResumeSuggestions(data.suggestions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingSuggestions(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (applicationToEdit) {
        await apiClient.patch(`/applications/${applicationToEdit._id}`, formData);
      } else {
        await apiClient.post("/applications", formData);
      }
      onSave();
      onClose();
    } catch (err) {
      setError("Failed to save application");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-card w-full max-w-3xl rounded-xl border border-slate-700 shadow-2xl my-8">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-textMain">
            {applicationToEdit ? "Edit Application" : "New Application"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {error && <div className="text-red-400 bg-red-400/10 p-3 rounded mb-4 text-sm">{error}</div>}

          {!applicationToEdit && (
            <div className="mb-8 bg-slate-800/50 p-4 rounded-xl border border-primary/20">
              <label className="flex items-center text-sm font-medium text-primary mb-2">
                <Sparkles className="w-4 h-4 mr-2" /> Auto-fill with AI
              </label>
              <textarea
                className="input-style min-h-[100px] mb-3 text-sm"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <button
                type="button"
                onClick={handleParseOption}
                disabled={parsing || !jobDescription}
                className="btn-primary flex items-center text-sm disabled:opacity-50"
              >
                {parsing ? <span className="animate-pulse">Parsing...</span> : "Generate Insights"}
              </button>

              {generatingSuggestions && (
                <div className="mt-4 text-sm text-slate-400 flex items-center">
                   <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
                   Generating tailored resume suggestions...
                </div>
              )}

              {resumeSuggestions.length > 0 && (
                <div className="mt-4 bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">AI Resume Suggestions</h4>
                  <ul className="space-y-3">
                    {resumeSuggestions.map((suggestion, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span className="flex-1">{suggestion}</span>
                        <button
                          onClick={() => handleCopy(suggestion, i)}
                          className="p-1.5 hover:bg-slate-800 rounded shrink-0 h-fit"
                        >
                          {copiedIndex === i ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-500" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <form id="app-form" onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Company</label>
              <input required className="input-style" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Role</label>
              <input required className="input-style" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Status</label>
              <select className="input-style" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                {["Applied", "Phone Screen", "Interview", "Offer", "Rejected"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Salary Range</label>
              <input className="input-style" placeholder="$80k - $100k" value={formData.salaryRange} onChange={e => setFormData({...formData, salaryRange: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-slate-400 mb-1 block">JD Link</label>
              <input className="input-style" placeholder="https://..." value={formData.jdLink} onChange={e => setFormData({...formData, jdLink: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-slate-400 mb-1 block">Notes</label>
              <textarea className="input-style min-h-[100px]" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-700 flex justify-between items-center">
          {applicationToEdit && onDelete ? (
             <button
               type="button"
               onClick={() => {
                 onDelete(applicationToEdit._id);
                 onClose();
               }}
               className="text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2"
             >
               Delete
             </button>
          ) : <div></div>}
          
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" form="app-form" disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save Application"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
