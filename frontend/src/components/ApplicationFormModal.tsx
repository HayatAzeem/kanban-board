import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import { Sparkles, Copy, Check, Loader2 } from "lucide-react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

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
    skills: "",
    niceToHave: "",
    seniority: "",
    location: "",
    resumeSuggestions: [] as string[],
  });
  const [parsing, setParsing] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (applicationToEdit) {
      setFormData({
        ...applicationToEdit,
        skills: applicationToEdit.skills?.join(", ") || "",
        niceToHave: applicationToEdit.niceToHave?.join(", ") || "",
        seniority: applicationToEdit.seniority || "",
        location: applicationToEdit.location || "",
        resumeSuggestions: applicationToEdit.resumeSuggestions || [],
      });
      setJobDescription("");
    } else {
      setFormData({
        company: "",
        role: "",
        jdLink: "",
        notes: "",
        salaryRange: "",
        status: "Applied",
        skills: "",
        niceToHave: "",
        seniority: "",
        location: "",
        resumeSuggestions: [],
      });
      setJobDescription("");
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
        skills: data.skills?.join(", ") || prev.skills,
        niceToHave: data.niceToHave?.join(", ") || prev.niceToHave,
        seniority: data.seniority || prev.seniority,
        location: data.location || prev.location,
      }));
      await fetchSuggestions(data.role, data.company);
    } catch (err: any) {
      setError("Failed to parse JD");
    } finally {
      setParsing(false);
    }
  };

  const fetchSuggestions = async (parsedRole?: string, parsedCompany?: string) => {
    setGeneratingSuggestions(true);
    try {
      const { data } = await apiClient.post("/applications/suggestions", {
        jobDescription,
        role: parsedRole || formData.role || "this role",
        company: parsedCompany || formData.company || "this company"
      });
      
      const suggestions = data.suggestions || [];
      setFormData((prev) => ({ ...prev, resumeSuggestions: suggestions }));
      
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
      const payload = {
        ...formData,
        skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
        niceToHave: formData.niceToHave ? formData.niceToHave.split(",").map((s) => s.trim()).filter(Boolean) : [],
      };

      if (applicationToEdit) {
        await apiClient.patch(`/applications/${applicationToEdit._id}`, payload);
      } else {
        await apiClient.post("/applications", payload);
      }
      onSave();
      onClose();
    } catch (err) {
      setError("Failed to save application");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={applicationToEdit ? "Edit Application" : "New Application"}
      className="max-w-2xl"
    >
      <div className="max-h-[60vh] overflow-y-auto pr-2 pb-4">
        {error && <div className="mb-4 rounded-md bg-danger/10 p-3 text-sm text-danger">{error}</div>}

        {!applicationToEdit && (
          <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-4">
            <label className="mb-2 flex items-center text-sm font-medium text-accent">
              <Sparkles className="mr-2 h-4 w-4" /> Auto-fill with AI
            </label>
            <textarea
              className="mb-3 flex min-h-[100px] w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-textMain placeholder:text-textMuted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <Button
              type="button"
              onClick={handleParseOption}
              disabled={parsing || !jobDescription}
              variant="secondary"
              size="sm"
            >
              {parsing ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              {parsing ? "Parsing..." : "Generate Insights"}
            </Button>

              {generatingSuggestions && (
              <div className="mt-4 flex items-center text-sm text-textMuted">
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-accent" />
                Generating tailored resume suggestions...
              </div>
            )}
          </div>
        )}

        <form id="app-form" onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-textMain">Company</label>
            <Input required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-textMain">Role</label>
            <Input required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-textMain">Seniority</label>
            <Input value={formData.seniority} onChange={(e) => setFormData({ ...formData, seniority: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-textMain">Location</label>
            <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-textMain">Required Skills (Comma separated)</label>
            <Input value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-textMain">Nice-to-Have Skills</label>
            <Input value={formData.niceToHave} onChange={(e) => setFormData({ ...formData, niceToHave: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-textMain">Status</label>
            <select
              className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-textMain outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              {["Applied", "Phone Screen", "Interview", "Offer", "Rejected"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-textMain">Salary Range</label>
            <Input placeholder="$80k - $100k" value={formData.salaryRange} onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })} />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-textMain">JD Link</label>
            <Input placeholder="https://..." value={formData.jdLink} onChange={(e) => setFormData({ ...formData, jdLink: e.target.value })} />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-textMain">Notes</label>
            <textarea
              className="flex min-h-[100px] w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-textMain outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </form>

        {formData.resumeSuggestions.length > 0 && (
          <div className="mt-8 rounded-lg bg-surface p-5 border border-border">
            <h4 className="mb-3 text-sm font-semibold text-textMain">AI Resume Suggestions</h4>
            <p className="text-xs text-textMuted mb-4">You can copy these bullets directly onto your resume to tailor it for this specific role.</p>
            <ul className="space-y-3">
              {formData.resumeSuggestions.map((suggestion, i) => (
                <li key={i} className="flex gap-3 text-sm text-textMain bg-background p-3 rounded-md border border-border/50">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="flex-1 leading-relaxed">{suggestion}</span>
                  <button
                    onClick={() => handleCopy(suggestion, i)}
                    title="Copy to Clipboard"
                    className="h-fit shrink-0 rounded p-1.5 hover:bg-surfaceHover text-textMuted transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {copiedIndex === i ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
        {applicationToEdit && onDelete ? (
          <Button type="button" variant="danger" onClick={() => { onDelete(applicationToEdit._id); onClose(); }}>
            Delete
          </Button>
        ) : <div />}
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="app-form" disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {saving ? "Saving..." : "Save Application"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
