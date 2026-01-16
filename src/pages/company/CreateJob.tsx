// FRONTEND FROZEN — BACKEND IS SOURCE OF TRUTH
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Users, IndianRupee, Gift, X, Plus, Sparkles, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import CompanyHeader from '@/components/CompanyHeader';
import AuraGuidance from '@/components/AuraGuidance';
import { useCompany } from '@/context/CompanyContext';
import type { CreateJobInput } from '@/types/company';

// ============= SIMULATED AI JD ANALYSIS =============
// Dummy extraction logic using keyword matching and regex

interface JDAnalysisResult {
  title: string;
  skills: string[];
  location: string;
  intake: number;
  stipend?: number;
  perks?: string;
}

const SKILL_KEYWORDS = [
  'react', 'angular', 'vue', 'javascript', 'typescript', 'python', 'java', 'node.js',
  'nodejs', 'express', 'mongodb', 'sql', 'mysql', 'postgresql', 'aws', 'docker',
  'kubernetes', 'git', 'html', 'css', 'tailwind', 'figma', 'photoshop', 'excel',
  'power bi', 'tableau', 'machine learning', 'ml', 'ai', 'data analysis', 'data science',
  'communication', 'teamwork', 'problem solving', 'agile', 'scrum', 'api', 'rest',
  'graphql', 'c++', 'c#', '.net', 'flutter', 'react native', 'swift', 'kotlin',
  'android', 'ios', 'linux', 'devops', 'ci/cd', 'testing', 'qa', 'selenium'
];

const analyzeJobDescription = async (jd: string): Promise<JDAnalysisResult> => {
  // Simulate AI processing latency (800-1200ms)
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

  const lowerJD = jd.toLowerCase();

  // Extract title - look for common patterns
  let title = '';
  const titlePatterns = [
    /(?:looking for|hiring|seeking|need|require)\s+(?:a\s+)?([a-z\s]+(?:intern|developer|engineer|analyst|designer|manager|executive|associate))/i,
    /(?:position|role|job title|opening)[\s:]+([a-z\s]+(?:intern|developer|engineer|analyst|designer|manager))/i,
    /^([a-z\s]+(?:intern|developer|engineer|analyst|designer|manager|executive))/im,
  ];
  
  for (const pattern of titlePatterns) {
    const match = jd.match(pattern);
    if (match) {
      title = match[1].trim().replace(/\s+/g, ' ');
      title = title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      break;
    }
  }

  if (!title) {
    // Fallback: check for common role keywords
    if (lowerJD.includes('software') && lowerJD.includes('intern')) title = 'Software Development Intern';
    else if (lowerJD.includes('frontend')) title = 'Frontend Developer';
    else if (lowerJD.includes('backend')) title = 'Backend Developer';
    else if (lowerJD.includes('full stack') || lowerJD.includes('fullstack')) title = 'Full Stack Developer';
    else if (lowerJD.includes('data analyst')) title = 'Data Analyst';
    else if (lowerJD.includes('data science')) title = 'Data Science Intern';
    else if (lowerJD.includes('marketing')) title = 'Marketing Intern';
    else if (lowerJD.includes('design')) title = 'Design Intern';
    else title = 'Intern';
  }

  // Extract skills - match against known keywords
  const skills: string[] = [];
  for (const skill of SKILL_KEYWORDS) {
    if (lowerJD.includes(skill.toLowerCase())) {
      // Capitalize properly
      const formatted = skill.split(' ').map(w => 
        ['ai', 'ml', 'qa', 'api', 'sql', 'aws', 'css', 'html'].includes(w.toLowerCase()) 
          ? w.toUpperCase() 
          : w.charAt(0).toUpperCase() + w.slice(1)
      ).join(' ');
      if (!skills.includes(formatted)) {
        skills.push(formatted);
      }
    }
  }

  // Extract location
  let location = '';
  const locationPatterns = [
    /(?:location|based in|office|work from)[\s:]+([a-z\s,]+?)(?:\.|,|$|\n)/i,
    /(bangalore|bengaluru|mumbai|delhi|hyderabad|chennai|pune|kolkata|noida|gurgaon|gurugram)[,\s]*(india|karnataka|maharashtra|telangana|tamil nadu)?/i,
    /(?:remote|work from home|wfh)/i,
  ];

  for (const pattern of locationPatterns) {
    const match = jd.match(pattern);
    if (match) {
      location = match[0].includes('remote') || match[0].includes('wfh') 
        ? 'Remote' 
        : match[1]?.trim() || '';
      location = location.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      break;
    }
  }

  // Extract intake/positions
  let intake = 1;
  const intakePatterns = [
    /(\d+)\s*(?:positions?|openings?|vacancies?|interns?|candidates?)/i,
    /(?:hiring|need|require|looking for)\s*(\d+)/i,
    /(?:positions?|openings?)\s*(?:available)?[\s:]*(\d+)/i,
  ];

  for (const pattern of intakePatterns) {
    const match = jd.match(pattern);
    if (match) {
      intake = parseInt(match[1], 10) || 1;
      break;
    }
  }

  // Extract stipend
  let stipend: number | undefined;
  const stipendPatterns = [
    /(?:stipend|salary|compensation|pay)[\s:]*(?:rs\.?|inr|₹)?\s*(\d{1,3}(?:,\d{3})*|\d+)(?:k|K)?/i,
    /(?:rs\.?|inr|₹)\s*(\d{1,3}(?:,\d{3})*|\d+)(?:k|K)?\s*(?:per month|\/month|p\.m\.?|pm)/i,
  ];

  for (const pattern of stipendPatterns) {
    const match = jd.match(pattern);
    if (match) {
      let amount = match[1].replace(/,/g, '');
      stipend = parseInt(amount, 10);
      if (jd.toLowerCase().includes(match[0].toLowerCase()) && (match[0].includes('k') || match[0].includes('K'))) {
        stipend *= 1000;
      }
      break;
    }
  }

  // Extract perks
  const perksKeywords = ['certificate', 'letter of recommendation', 'lor', 'flexible', 'remote', 
    'wfh', 'work from home', 'mentorship', 'training', 'ppo', 'pre-placement', 'bonus', 
    'health insurance', 'snacks', 'meals', 'team outings'];
  
  const foundPerks: string[] = [];
  for (const perk of perksKeywords) {
    if (lowerJD.includes(perk)) {
      const formatted = perk === 'lor' ? 'Letter of Recommendation' 
        : perk === 'ppo' ? 'PPO (Pre-Placement Offer)'
        : perk === 'wfh' ? 'Work from Home'
        : perk.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      if (!foundPerks.includes(formatted)) {
        foundPerks.push(formatted);
      }
    }
  }

  return {
    title,
    skills: skills.slice(0, 10), // Limit to 10 skills
    location,
    intake: Math.min(intake, 100), // Cap at 100
    stipend,
    perks: foundPerks.length > 0 ? foundPerks.join(', ') : undefined,
  };
};

// ============= AI SUGGESTED HINT COMPONENT =============
const AISuggestedHint: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;
  return (
    <span className="inline-flex items-center gap-1 ml-2 text-xs text-primary/80">
      <Sparkles className="w-3 h-3" />
      AI suggested
    </span>
  );
};

// ============= MAIN COMPONENT =============
const CreateJob: React.FC = () => {
  const navigate = useNavigate();
  const { createJob, processJob, isLoading } = useCompany();

  // JD Analysis state
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Form fields with AI suggestion tracking
  const [title, setTitle] = useState('');
  const [titleSuggested, setTitleSuggested] = useState(false);
  
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillsSuggested, setSkillsSuggested] = useState(false);
  
  const [locationLabel, setLocationLabel] = useState('');
  const [locationSuggested, setLocationSuggested] = useState(false);
  
  const [intake, setIntake] = useState('');
  const [intakeSuggested, setIntakeSuggested] = useState(false);
  
  const [stipend, setStipend] = useState('');
  const [stipendSuggested, setStipendSuggested] = useState(false);
  
  const [perks, setPerks] = useState('');
  const [perksSuggested, setPerksSuggested] = useState(false);
  
  const [error, setError] = useState('');

  const handleAnalyzeJD = async () => {
    if (jobDescription.length < 100) {
      setError('Please enter a more detailed job description (at least 100 characters)');
      return;
    }

    setError('');
    setIsAnalyzing(true);

    try {
      const result = await analyzeJobDescription(jobDescription);

      // Auto-fill fields and mark as AI suggested
      if (result.title) {
        setTitle(result.title);
        setTitleSuggested(true);
      }
      if (result.skills.length > 0) {
        setSkills(result.skills);
        setSkillsSuggested(true);
      }
      if (result.location) {
        setLocationLabel(result.location);
        setLocationSuggested(true);
      }
      if (result.intake) {
        setIntake(result.intake.toString());
        setIntakeSuggested(true);
      }
      if (result.stipend) {
        setStipend(result.stipend.toString());
        setStipendSuggested(true);
      }
      if (result.perks) {
        setPerks(result.perks);
        setPerksSuggested(true);
      }

      setHasAnalyzed(true);
    } catch {
      setError('Failed to analyze job description. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
      setSkillsSuggested(false); // Manual edit clears AI hint
    }
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
    if (skills.length <= 1) setSkillsSuggested(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!jobDescription.trim() || jobDescription.length < 100) {
      setError('A detailed job description is required (at least 100 characters)');
      return;
    }

    if (!title.trim()) {
      setError('Job title is required');
      return;
    }

    if (skills.length === 0) {
      setError('At least one skill is required');
      return;
    }

    if (!locationLabel.trim()) {
      setError('Location is required');
      return;
    }

    const intakeNum = parseInt(intake, 10);
    if (isNaN(intakeNum) || intakeNum < 1) {
      setError('Intake capacity must be at least 1');
      return;
    }

    try {
      const jobData: CreateJobInput = {
        title: title.trim(),
        requiredSkills: skills,
        location: {
          lat: 28.6139 + (Math.random() - 0.5) * 0.1,
          lng: 77.2090 + (Math.random() - 0.5) * 0.1,
          label: locationLabel.trim(),
        },
        intake: intakeNum,
        stipend: stipend ? parseInt(stipend, 10) : undefined,
        perks: perks.trim() || undefined,
        originalJD: jobDescription.trim(),
      };

      const job = await createJob(jobData);
      await processJob(job.id);
      navigate('/company/jobs/status');
    } catch {
      setError('Failed to create job. Please try again.');
    }
  };

  const jdCharCount = jobDescription.length;
  const isJDValid = jdCharCount >= 100 && jdCharCount <= 5000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <CompanyHeader title="Create Job Posting" />

      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-border rounded-2xl shadow-lg p-8"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Define Your Requirements
            </h1>
            <p className="text-muted-foreground">
              Paste your job description and let our AI extract the key details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* JD Textarea - PRIMARY INPUT */}
            <div className="space-y-2">
              <Label htmlFor="jd" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Paste Job Description *
              </Label>
              <Textarea
                id="jd"
                placeholder="Paste your complete job description here. Include details about the role, required skills, location, stipend, and any perks..."
                value={jobDescription}
                onChange={(e) => {
                  setJobDescription(e.target.value);
                  setHasAnalyzed(false); // Reset analysis state on edit
                }}
                className="min-h-[200px] resize-none"
                disabled={isLoading || isAnalyzing}
                maxLength={5000}
              />
              <div className="flex justify-between items-center text-xs">
                <span className={jdCharCount < 100 ? 'text-muted-foreground' : 'text-primary'}>
                  {jdCharCount}/5000 characters {jdCharCount < 100 && '(min 100)'}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAnalyzeJD}
                  disabled={!isJDValid || isAnalyzing || isLoading}
                  className="gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze JD
                    </>
                  )}
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {hasAnalyzed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-primary/5 border border-primary/20 rounded-lg p-3"
                >
                  <p className="text-sm text-primary flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Analysis complete! Review the extracted details below and make any adjustments.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center">
                Job Title *
                <AISuggestedHint show={titleSuggested} />
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Software Development Intern"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setTitleSuggested(false);
                  }}
                  className="pl-10"
                  disabled={isLoading || isAnalyzing}
                  maxLength={100}
                />
              </div>
            </div>

            {/* Required Skills */}
            <div className="space-y-2">
              <Label className="flex items-center">
                Required Skills *
                <AISuggestedHint show={skillsSuggested} />
              </Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Add a skill and press Enter"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  disabled={isLoading || isAnalyzing}
                  maxLength={50}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddSkill}
                  disabled={!skillInput.trim() || isLoading || isAnalyzing}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center">
                Location *
                <AISuggestedHint show={locationSuggested} />
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., Bangalore, Karnataka"
                  value={locationLabel}
                  onChange={(e) => {
                    setLocationLabel(e.target.value);
                    setLocationSuggested(false);
                  }}
                  className="pl-10"
                  disabled={isLoading || isAnalyzing}
                  maxLength={100}
                />
              </div>
            </div>

            {/* Intake Capacity */}
            <div className="space-y-2">
              <Label htmlFor="intake" className="flex items-center">
                Intake Capacity *
                <AISuggestedHint show={intakeSuggested} />
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="intake"
                  type="number"
                  placeholder="Number of interns needed"
                  value={intake}
                  onChange={(e) => {
                    setIntake(e.target.value);
                    setIntakeSuggested(false);
                  }}
                  className="pl-10"
                  disabled={isLoading || isAnalyzing}
                  min={1}
                  max={1000}
                />
              </div>
            </div>

            {/* Stipend (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="stipend" className="flex items-center">
                Monthly Stipend (Optional)
                <AISuggestedHint show={stipendSuggested} />
              </Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="stipend"
                  type="number"
                  placeholder="e.g., 15000"
                  value={stipend}
                  onChange={(e) => {
                    setStipend(e.target.value);
                    setStipendSuggested(false);
                  }}
                  className="pl-10"
                  disabled={isLoading || isAnalyzing}
                  min={0}
                />
              </div>
            </div>

            {/* Perks (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="perks" className="flex items-center">
                Perks (Optional)
                <AISuggestedHint show={perksSuggested} />
              </Label>
              <div className="relative">
                <Gift className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Textarea
                  id="perks"
                  placeholder="e.g., Certificate, Letter of Recommendation, Flexible hours..."
                  value={perks}
                  onChange={(e) => {
                    setPerks(e.target.value);
                    setPerksSuggested(false);
                  }}
                  className="pl-10 min-h-[80px]"
                  disabled={isLoading || isAnalyzing}
                  maxLength={500}
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-destructive text-center"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading || 
                isAnalyzing || 
                !jobDescription.trim() || 
                jdCharCount < 100 ||
                !title.trim() || 
                skills.length === 0 || 
                !locationLabel.trim() || 
                !intake
              }
            >
              {isLoading ? 'Submitting...' : 'Submit Job for Processing'}
            </Button>
          </form>
        </motion.div>

        <div className="mt-6">
          <AuraGuidance
            message="Paste your complete job description and click 'Analyze JD' to auto-fill the form. You can review and edit any field before submitting."
          />
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
