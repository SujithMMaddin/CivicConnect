import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  MapPin, 
  Camera, 
  X,
  Construction,
  Trash2,
  Droplets,
  Zap,
  Lightbulb,
  HelpCircle,
  Pipette,
  CheckCircle2
} from 'lucide-react';
import MobileLayout from '@/react-app/components/layout/MobileLayout';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Textarea } from '@/react-app/components/ui/textarea';
import { Label } from '@/react-app/components/ui/label';
import { IssueCategory, categoryLabels } from '@/react-app/data/issues';
import { cn } from '@/react-app/lib/utils';

const categories: { value: IssueCategory; label: string; icon: React.ElementType }[] = [
  { value: 'road', label: 'Road & Pavement', icon: Construction },
  { value: 'garbage', label: 'Garbage & Waste', icon: Trash2 },
  { value: 'water', label: 'Water Supply', icon: Droplets },
  { value: 'electricity', label: 'Electricity', icon: Zap },
  { value: 'sewage', label: 'Sewage & Drainage', icon: Pipette },
  { value: 'streetlight', label: 'Street Lighting', icon: Lightbulb },
  { value: 'other', label: 'Other', icon: HelpCircle },
];

export default function ReportPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<IssueCategory | null>(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalSteps = 3;

  const handleImageUpload = () => {
    // Simulated image upload
    if (images.length < 3) {
      const placeholderImages = [
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
      ];
      setImages([...images, placeholderImages[images.length]]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const canProceed = () => {
    if (step === 1) return category !== null;
    if (step === 2) return location.trim().length > 0;
    if (step === 3) return description.trim().length > 10;
    return false;
  };

  if (isSubmitted) {
    return (
      <MobileLayout hideNav>
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6 animate-fade-in">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2 animate-fade-in">
            Report Submitted!
          </h1>
          <p className="text-muted-foreground mb-8 animate-fade-in">
            Thank you for helping improve your community. We'll review your report and take action.
          </p>
          <div className="space-y-3 w-full max-w-xs animate-slide-up">
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              Back to Home
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/issues')} 
              className="w-full"
            >
              View All Issues
            </Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
              className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="font-semibold text-foreground">Report Issue</h1>
              <p className="text-xs text-muted-foreground">Step {step} of {totalSteps}</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="flex gap-1 mt-3">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 rounded-full flex-1 transition-colors duration-300",
                  i < step ? "bg-primary" : "bg-secondary"
                )}
              />
            ))}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Step 1: Category Selection */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  What type of issue?
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Select the category that best describes the problem
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.value;
                  
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-xl transition-colors",
                        isSelected ? "bg-primary/10" : "bg-secondary"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5 transition-colors",
                          isSelected ? "text-primary" : "text-secondary-foreground"
                        )} />
                      </div>
                      <span className={cn(
                        "text-xs font-medium text-center transition-colors",
                        isSelected ? "text-primary" : "text-foreground"
                      )}>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Where is the issue?
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter the address or use the map to pinpoint the location
                </p>
              </div>
              
              {/* Map placeholder */}
              <div className="h-48 bg-secondary rounded-xl relative overflow-hidden border border-border">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-10 w-10 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Tap to select location</p>
                  </div>
                </div>
                {/* Crosshair overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 border-2 border-primary rounded-full opacity-50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Enter street address..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => setLocation('123 Main Street, Downtown')}
              >
                <MapPin className="h-4 w-4" />
                Use Current Location
              </Button>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Describe the issue
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Provide details to help us understand and address the problem
                </p>
              </div>

              {/* Summary */}
              <div className="bg-secondary/50 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium text-foreground">
                    {category ? categoryLabels[category] : '—'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium text-foreground truncate">{location || '—'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please describe the issue in detail. Include any relevant information that could help us resolve it faster..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {description.length} characters
                </p>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Photos (optional)</Label>
                <div className="flex gap-2 flex-wrap">
                  {images.map((img, index) => (
                    <div key={index} className="relative w-20 h-20">
                      <img
                        src={img}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-border"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full shadow-md"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 3 && (
                    <button
                      onClick={handleImageUpload}
                      className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-1"
                    >
                      <Camera className="h-5 w-5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Add</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Max 3 photos. Tap to add.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action */}
        <div className="sticky bottom-0 bg-card border-t border-border p-4">
          {step < totalSteps ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="w-full"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
