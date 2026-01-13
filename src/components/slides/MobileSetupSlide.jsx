import { motion } from 'framer-motion';
import {
  Smartphone,
  Download,
  Check,
  Apple,
  PlayCircle,
  Calendar,
  LayoutGrid,
  CheckSquare,
  ArrowRight,
  Bell,
  Plus,
  GripVertical,
  FileText
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useState } from 'react';
import { jsPDF } from 'jspdf';

// Mobile setup data for all three tools
export const mobileSetupGuides = {
  calendar: {
    title: 'Google Calendar',
    icon: Calendar,
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-500',
    android: [
      { step: 'Open Google Calendar app', hint: 'Pre-installed on most Android phones' },
      { step: 'Sign in with Google account', hint: 'Enter your Gmail and password' },
      { step: 'Allow notifications', hint: 'Stay on top of your schedule' },
      { step: 'Done! Calendar syncs automatically', hint: '' },
    ],
    iphone: [
      { step: 'Download from App Store', hint: 'Search "Google Calendar"' },
      { step: 'Open app and sign in', hint: 'Use your Gmail account' },
      { step: 'Allow notifications', hint: 'Tap Allow when prompted' },
      { step: 'Done! Calendar syncs automatically', hint: '' },
    ],
    quickTips: [
      { action: 'Create event', how: 'Tap the + button' },
      { action: 'View week', how: 'Pinch outward on screen' },
      { action: 'Add Focus Time', how: 'Create event → "Focus Time - Do Not Book"' },
    ]
  },
  trello: {
    title: 'Trello',
    icon: LayoutGrid,
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-500',
    android: [
      { step: 'Open Play Store', hint: 'Search "Trello"' },
      { step: 'Tap Install', hint: 'Wait for download' },
      { step: 'Open and sign up/sign in', hint: 'Use Email, Google, or Microsoft' },
      { step: 'Create your first board', hint: 'Tap + → Create board' },
    ],
    iphone: [
      { step: 'Open App Store', hint: 'Search "Trello"' },
      { step: 'Tap Get to install', hint: 'Wait for download' },
      { step: 'Open and sign up/sign in', hint: 'Use Email, Google, or Apple ID' },
      { step: 'Create your first board', hint: 'Tap + → Create board' },
    ],
    quickTips: [
      { action: 'Add list', how: 'Tap "Add list" → Name it' },
      { action: 'Add card', how: 'Tap + Add card under any list' },
      { action: 'Move card', how: 'Press and drag to another list' },
    ]
  },
  asana: {
    title: 'Asana',
    icon: CheckSquare,
    color: 'rose',
    gradient: 'from-rose-500 to-orange-500',
    android: [
      { step: 'Open Play Store', hint: 'Search "Asana"' },
      { step: 'Tap Install', hint: 'Wait for download' },
      { step: 'Open and sign up', hint: 'Use work email or Google' },
      { step: 'Create workspace', hint: 'Name it and skip invites for now' },
    ],
    iphone: [
      { step: 'Open App Store', hint: 'Search "Asana"' },
      { step: 'Tap Get to install', hint: 'Wait for download' },
      { step: 'Open and sign up', hint: 'Use work email or Google' },
      { step: 'Create workspace', hint: 'Name it and skip invites for now' },
    ],
    quickTips: [
      { action: 'Create project', how: 'Tap + → Project → Name it' },
      { action: 'Add task', how: 'Tap + Add task' },
      { action: 'Complete task', how: 'Swipe right on task' },
    ]
  }
};

// Color configurations for PDF
const pdfColors = {
  calendar: { r: 6, g: 182, b: 212 },    // cyan-500
  trello: { r: 99, g: 102, b: 241 },     // indigo-500
  asana: { r: 244, g: 63, b: 94 },       // rose-500
  header: { r: 15, g: 23, b: 42 },       // slate-900
  text: { r: 51, g: 65, b: 85 },         // slate-700
  hint: { r: 100, g: 116, b: 139 },      // slate-500
  accent: { r: 16, g: 185, b: 129 },     // emerald-500
};

// Generate PDF for a single tool
function generatePDF(tool) {
  const guide = mobileSetupGuides[tool];
  const color = pdfColors[tool];
  const doc = new jsPDF();

  let y = 20;
  const leftMargin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header background
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(guide.title, leftMargin, 25);

  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Mobile Setup Guide', leftMargin, 35);

  y = 60;

  // CSTC Badge
  doc.setFontSize(9);
  doc.setTextColor(pdfColors.hint.r, pdfColors.hint.g, pdfColors.hint.b);
  doc.text('Civil Service Training Centre', pageWidth - 20, 55, { align: 'right' });

  // Android Section
  doc.setFillColor(34, 197, 94); // green-500
  doc.roundedRect(leftMargin, y, 8, 8, 2, 2, 'F');
  doc.setTextColor(pdfColors.header.r, pdfColors.header.g, pdfColors.header.b);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('For Android', leftMargin + 12, y + 6);

  y += 15;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  guide.android.forEach((step, i) => {
    doc.setTextColor(color.r, color.g, color.b);
    doc.setFont('helvetica', 'bold');
    doc.text(`${i + 1}.`, leftMargin, y);

    doc.setTextColor(pdfColors.text.r, pdfColors.text.g, pdfColors.text.b);
    doc.setFont('helvetica', 'normal');
    doc.text(step.step, leftMargin + 8, y);

    if (step.hint) {
      y += 5;
      doc.setTextColor(pdfColors.hint.r, pdfColors.hint.g, pdfColors.hint.b);
      doc.setFontSize(9);
      doc.text(`→ ${step.hint}`, leftMargin + 8, y);
      doc.setFontSize(11);
    }
    y += 8;
  });

  y += 10;

  // iPhone Section
  doc.setFillColor(51, 51, 51); // dark gray for Apple
  doc.roundedRect(leftMargin, y, 8, 8, 2, 2, 'F');
  doc.setTextColor(pdfColors.header.r, pdfColors.header.g, pdfColors.header.b);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('For iPhone', leftMargin + 12, y + 6);

  y += 15;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  guide.iphone.forEach((step, i) => {
    doc.setTextColor(color.r, color.g, color.b);
    doc.setFont('helvetica', 'bold');
    doc.text(`${i + 1}.`, leftMargin, y);

    doc.setTextColor(pdfColors.text.r, pdfColors.text.g, pdfColors.text.b);
    doc.setFont('helvetica', 'normal');
    doc.text(step.step, leftMargin + 8, y);

    if (step.hint) {
      y += 5;
      doc.setTextColor(pdfColors.hint.r, pdfColors.hint.g, pdfColors.hint.b);
      doc.setFontSize(9);
      doc.text(`→ ${step.hint}`, leftMargin + 8, y);
      doc.setFontSize(11);
    }
    y += 8;
  });

  y += 10;

  // Quick Tips Section
  doc.setFillColor(pdfColors.accent.r, pdfColors.accent.g, pdfColors.accent.b);
  doc.roundedRect(leftMargin, y, pageWidth - 40, 45, 3, 3, 'F');

  y += 10;
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Quick Tips', leftMargin + 8, y);

  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  guide.quickTips.forEach((tip) => {
    doc.text(`•  ${tip.action}: ${tip.how}`, leftMargin + 8, y);
    y += 6;
  });

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(0.5);
  doc.line(leftMargin, footerY - 5, pageWidth - leftMargin, footerY - 5);

  doc.setTextColor(pdfColors.hint.r, pdfColors.hint.g, pdfColors.hint.b);
  doc.setFontSize(8);
  doc.text('CSTC Productivity Tools Training', leftMargin, footerY);
  doc.text('January 2026', pageWidth - leftMargin, footerY, { align: 'right' });

  return doc;
}

// Download handler for single guide
function downloadGuide(tool) {
  const guide = mobileSetupGuides[tool];
  const doc = generatePDF(tool);
  doc.save(`${guide.title.replace(/\s+/g, '-')}-Mobile-Setup-Guide.pdf`);
}

// Download all guides as one PDF file
export function downloadAllGuides() {
  const doc = new jsPDF();
  const tools = Object.keys(mobileSetupGuides);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Cover page
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative circles
  doc.setFillColor(6, 182, 212, 0.3); // cyan with opacity
  doc.circle(30, 50, 40, 'F');
  doc.setFillColor(99, 102, 241, 0.3); // indigo with opacity
  doc.circle(pageWidth - 30, 100, 35, 'F');
  doc.setFillColor(244, 63, 94, 0.3); // rose with opacity
  doc.circle(50, pageHeight - 60, 30, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('Mobile Setup Guides', pageWidth / 2, 100, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Productivity Tools Training', pageWidth / 2, 115, { align: 'center' });

  // Tool list
  let y = 150;
  const toolNames = ['Google Calendar', 'Trello', 'Asana'];
  const colors = [pdfColors.calendar, pdfColors.trello, pdfColors.asana];

  toolNames.forEach((name, i) => {
    doc.setFillColor(colors[i].r, colors[i].g, colors[i].b);
    doc.roundedRect(pageWidth / 2 - 50, y - 5, 100, 14, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text(name, pageWidth / 2, y + 4, { align: 'center' });
    y += 22;
  });

  // Footer on cover
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(10);
  doc.text('Civil Service Training Centre', pageWidth / 2, pageHeight - 30, { align: 'center' });
  doc.text('January 2026', pageWidth / 2, pageHeight - 22, { align: 'center' });

  // Add individual guide pages
  tools.forEach((tool) => {
    doc.addPage();
    const guide = mobileSetupGuides[tool];
    const color = pdfColors[tool];

    let y = 20;
    const leftMargin = 20;

    // Header background
    doc.setFillColor(color.r, color.g, color.b);
    doc.rect(0, 0, pageWidth, 45, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(guide.title, leftMargin, 25);

    // Subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Mobile Setup Guide', leftMargin, 35);

    y = 60;

    // Android Section
    doc.setFillColor(34, 197, 94);
    doc.roundedRect(leftMargin, y, 8, 8, 2, 2, 'F');
    doc.setTextColor(pdfColors.header.r, pdfColors.header.g, pdfColors.header.b);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('For Android', leftMargin + 12, y + 6);

    y += 15;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    guide.android.forEach((step, i) => {
      doc.setTextColor(color.r, color.g, color.b);
      doc.setFont('helvetica', 'bold');
      doc.text(`${i + 1}.`, leftMargin, y);

      doc.setTextColor(pdfColors.text.r, pdfColors.text.g, pdfColors.text.b);
      doc.setFont('helvetica', 'normal');
      doc.text(step.step, leftMargin + 8, y);

      if (step.hint) {
        y += 5;
        doc.setTextColor(pdfColors.hint.r, pdfColors.hint.g, pdfColors.hint.b);
        doc.setFontSize(9);
        doc.text(`→ ${step.hint}`, leftMargin + 8, y);
        doc.setFontSize(11);
      }
      y += 8;
    });

    y += 10;

    // iPhone Section
    doc.setFillColor(51, 51, 51);
    doc.roundedRect(leftMargin, y, 8, 8, 2, 2, 'F');
    doc.setTextColor(pdfColors.header.r, pdfColors.header.g, pdfColors.header.b);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('For iPhone', leftMargin + 12, y + 6);

    y += 15;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    guide.iphone.forEach((step, i) => {
      doc.setTextColor(color.r, color.g, color.b);
      doc.setFont('helvetica', 'bold');
      doc.text(`${i + 1}.`, leftMargin, y);

      doc.setTextColor(pdfColors.text.r, pdfColors.text.g, pdfColors.text.b);
      doc.setFont('helvetica', 'normal');
      doc.text(step.step, leftMargin + 8, y);

      if (step.hint) {
        y += 5;
        doc.setTextColor(pdfColors.hint.r, pdfColors.hint.g, pdfColors.hint.b);
        doc.setFontSize(9);
        doc.text(`→ ${step.hint}`, leftMargin + 8, y);
        doc.setFontSize(11);
      }
      y += 8;
    });

    y += 10;

    // Quick Tips Section
    doc.setFillColor(pdfColors.accent.r, pdfColors.accent.g, pdfColors.accent.b);
    doc.roundedRect(leftMargin, y, pageWidth - 40, 45, 3, 3, 'F');

    y += 10;
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Quick Tips', leftMargin + 8, y);

    y += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    guide.quickTips.forEach((tip) => {
      doc.text(`•  ${tip.action}: ${tip.how}`, leftMargin + 8, y);
      y += 6;
    });

    // Footer
    const footerY = pageHeight - 15;
    doc.setDrawColor(color.r, color.g, color.b);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, footerY - 5, pageWidth - leftMargin, footerY - 5);

    doc.setTextColor(pdfColors.hint.r, pdfColors.hint.g, pdfColors.hint.b);
    doc.setFontSize(8);
    doc.text('CSTC Productivity Tools Training', leftMargin, footerY);
    doc.text('January 2026', pageWidth - leftMargin, footerY, { align: 'right' });
  });

  doc.save('CSTC-Mobile-Setup-Guides-Complete.pdf');
}

// Phone mockup component
function PhoneMockup({ children, platform }) {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Phone frame */}
      <div className={`relative w-48 h-80 rounded-[2rem] p-2 ${
        isDark ? 'bg-slate-700' : 'bg-slate-800'
      } shadow-2xl`}>
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-10" />

        {/* Screen */}
        <div className={`w-full h-full rounded-[1.5rem] overflow-hidden ${
          isDark ? 'bg-slate-900' : 'bg-white'
        }`}>
          {/* Status bar */}
          <div className={`h-6 flex items-center justify-between px-4 text-[10px] ${
            isDark ? 'bg-slate-800 text-white/60' : 'bg-slate-100 text-slate-500'
          }`}>
            <span>9:41</span>
            <span>{platform === 'android' ? '📶 🔋' : '📶 100%'}</span>
          </div>

          {/* Content */}
          <div className="p-3 h-[calc(100%-1.5rem)] overflow-hidden">
            {children}
          </div>
        </div>
      </div>

      {/* Platform badge */}
      <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
        platform === 'android'
          ? 'bg-green-500 text-white'
          : 'bg-slate-800 text-white'
      }`}>
        {platform === 'android' ? <PlayCircle size={12} /> : <Apple size={12} />}
        {platform === 'android' ? 'Android' : 'iPhone'}
      </div>
    </motion.div>
  );
}

// Step list component
function StepList({ steps, color }) {
  const { isDark } = useTheme();
  const colors = {
    cyan: 'bg-cyan-500',
    indigo: 'bg-indigo-500',
    rose: 'bg-rose-500',
  };

  return (
    <div className="space-y-2">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-start gap-2"
        >
          <div className={`w-5 h-5 rounded-full ${colors[color]} text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5`}>
            {i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {step.step}
            </p>
            {step.hint && (
              <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                {step.hint}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Main Mobile Setup Slide Component
export function MobileSetupSlide({ tool }) {
  const { isDark } = useTheme();
  const [platform, setPlatform] = useState('android');
  const guide = mobileSetupGuides[tool];
  const Icon = guide.icon;

  const steps = platform === 'android' ? guide.android : guide.iphone;

  return (
    <div className={`min-h-[500px] rounded-3xl p-8 ${
      isDark ? 'bg-slate-800/50' : 'bg-white'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${guide.gradient} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <Smartphone className={`w-5 h-5 ${isDark ? 'text-white/60' : 'text-slate-500'}`} />
              <span className={`text-sm font-medium uppercase tracking-wide ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                Mobile Setup Guide
              </span>
            </div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {guide.title} on Your Phone
            </h2>
          </div>
        </div>

        {/* Download button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => downloadGuide(tool)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            isDark
              ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
          }`}
        >
          <Download size={18} />
          <span>Download Guide</span>
        </motion.button>
      </div>

      {/* Platform toggle */}
      <div className="flex justify-center mb-8">
        <div className={`inline-flex rounded-xl p-1 ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
          <button
            onClick={() => setPlatform('android')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
              platform === 'android'
                ? 'bg-green-500 text-white shadow-lg'
                : isDark ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <PlayCircle size={18} />
            Android
          </button>
          <button
            onClick={() => setPlatform('iphone')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
              platform === 'iphone'
                ? 'bg-slate-800 text-white shadow-lg'
                : isDark ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Apple size={18} />
            iPhone
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Steps */}
        <motion.div
          key={platform}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`rounded-2xl p-6 ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'}`}
        >
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${guide.gradient} flex items-center justify-center`}>
              <FileText className="w-4 h-4 text-white" />
            </span>
            Setup Steps
          </h3>
          <StepList steps={steps} color={guide.color} />
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-6 ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'}`}
        >
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <span className={`w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center`}>
              <Bell className="w-4 h-4 text-white" />
            </span>
            Quick Tips
          </h3>
          <div className="space-y-3">
            {guide.quickTips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  isDark ? 'bg-slate-600/30' : 'bg-white border border-slate-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${guide.gradient} flex items-center justify-center flex-shrink-0`}>
                  {i === 0 && <Plus className="w-4 h-4 text-white" />}
                  {i === 1 && <GripVertical className="w-4 h-4 text-white" />}
                  {i === 2 && <Check className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {tip.action}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                    {tip.how}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// All Guides Download Slide
export function AllGuidesDownloadSlide() {
  const { isDark } = useTheme();
  const tools = Object.entries(mobileSetupGuides);

  return (
    <div className={`min-h-[500px] rounded-3xl p-8 flex flex-col items-center justify-center ${
      isDark ? 'bg-slate-800/50' : 'bg-white'
    }`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-xl`}>
          <Download className="w-10 h-10 text-white" />
        </div>
        <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          Take These Guides With You
        </h2>
        <p className={`text-lg ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
          Download mobile setup guides for all three tools
        </p>
      </motion.div>

      {/* Tool cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8 w-full max-w-3xl">
        {tools.map(([key, guide], i) => {
          const Icon = guide.icon;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => downloadGuide(key)}
              className={`cursor-pointer rounded-2xl p-5 text-center transition-all ${
                isDark
                  ? 'bg-slate-700/50 hover:bg-slate-700 border border-slate-600'
                  : 'bg-slate-50 hover:bg-white border border-slate-200 hover:shadow-lg'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${guide.gradient} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {guide.title}
              </h3>
              <p className={`text-xs flex items-center justify-center gap-1 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                <Download size={12} />
                Tap to download
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Download all button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={downloadAllGuides}
        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-2xl shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all"
      >
        <Download size={22} />
        <span>Download All Guides</span>
        <ArrowRight size={18} />
      </motion.button>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className={`mt-6 text-sm ${isDark ? 'text-white/40' : 'text-slate-400'}`}
      >
        Guides include step-by-step instructions for Android & iPhone
      </motion.p>
    </div>
  );
}
