import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, TextField, MenuItem, Button, Chip, Autocomplete,
  CircularProgress, Alert, Grid, Checkbox, FormControlLabel, FormGroup, FormLabel,
} from '@mui/material';
import { interviewerAuthService } from '@/services/api/iaem';
import { SENIORITY_OPTIONS } from '@/constants/iaem';
import {
  parsePhoneNumberFromString,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
} from 'libphonenumber-js/max';
import phoneExamples from 'libphonenumber-js/examples.mobile.json';

const SKILL_OPTIONS = ['JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'Python', 'Django', 'Java', 'Spring', 'Go', 'Rust', 'C++', 'SQL', 'PostgreSQL', 'MongoDB', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'System Design', 'ML', 'Data Science', 'DevOps', 'iOS', 'Android', 'Flutter', 'UX Research', 'Figma', 'Product Strategy', 'Analytics'];
const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi', 'Urdu', 'French', 'German', 'Spanish', 'Japanese', 'Korean', 'Mandarin'];
const TIMEZONE_OPTIONS = ['Asia/Kolkata', 'America/New_York', 'America/Los_Angeles', 'America/Chicago', 'Europe/London', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Singapore', 'Australia/Sydney', 'Pacific/Auckland'];

// ── Country phone code dropdown data ──
const REGION_NAMES =
  typeof Intl !== 'undefined' && Intl.DisplayNames
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null;
const PRIORITY_ISO = ['IN', 'US', 'GB', 'AE', 'SG', 'AU', 'CA'];
const COUNTRY_CODES = (() => {
  const list = getCountries().map((iso2) => ({
    value: iso2,
    iso: iso2.toLowerCase(),
    code: `+${getCountryCallingCode(iso2)}`,
    name: REGION_NAMES?.of(iso2) || iso2,
  }));
  const rank = (c) => {
    const i = PRIORITY_ISO.indexOf(c.value);
    return i === -1 ? PRIORITY_ISO.length : i;
  };
  return list.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
})();
const getCountry = (v) => COUNTRY_CODES.find((c) => c.value === v) || COUNTRY_CODES[0];
const _exampleCache = {};
const phoneExample = (iso) => {
  if (_exampleCache[iso] === undefined) {
    const ex = getExampleNumber(iso, phoneExamples);
    _exampleCache[iso] = ex ? ex.nationalNumber : '';
  }
  return _exampleCache[iso];
};

// ── Validators ──
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const validateEmail = (v) => {
  if (!v) return '';
  if (!EMAIL_RE.test(v.trim())) return 'Enter a valid email address';
  return '';
};
const validatePhone = (digits, countryIso) => {
  if (!digits) return '';
  const cleaned = String(digits).replace(/\D/g, '');
  if (!cleaned) return 'Enter a valid phone number';
  const parsed = parsePhoneNumberFromString(cleaned, countryIso);
  if (!parsed || !parsed.isValid()) {
    const c = getCountry(countryIso);
    const ex = phoneExample(countryIso);
    return `Not a valid ${c.name} number${ex ? ` — e.g. ${ex}` : ''}`;
  }
  const type = parsed.getType();
  if (type && !['MOBILE', 'FIXED_LINE_OR_MOBILE', 'PERSONAL_NUMBER'].includes(type)) {
    return 'Please enter a mobile number';
  }
  return '';
};

// ── Stepper (UI only) — same rail design as CompanyRegisterForm ──
const STEP_LABELS = ['Personal', 'Verify Email', 'Professional', 'Review'];
const STEP_HEADS = [
  { lead: 'Tell us about', accent: 'yourself',     sub: 'Your name and how HR can reach you.' },
  { lead: 'Verify your',   accent: 'email',        sub: 'A six-digit code is on its way to the address you entered.' },
  { lead: 'Your',          accent: 'professional', sub: 'Your company, your role, and what you interview for.', tail: 'profile' },
  { lead: 'One last',      accent: 'look',         sub: 'Check every section. Edit takes you straight back to it.' },
];
const R_INK        = '#1F1F1F';
const R_INK_DEEP   = '#000000';
const R_SAGE       = '#7F9E7E';
const R_SAGE_DARK  = '#6C8B6B';
const R_MUTED      = '#6F7470';
const R_FAINT      = '#A8ACA6';
const R_LINE       = '#E1E5DE';
const R_LINE_HOVER = '#BFC8BC';
const R_TRACK      = '#E7EBE5';
const R_SAGE_WASH  = 'rgba(127,158,126,0.07)';

const StepRail = ({ steps, step, onStepClick }) => (
  <Box sx={{ mb: { xs: 3, sm: 3.5 } }}>
    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, mb: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: R_INK, letterSpacing: '-0.01em' }}>
        {steps[step]}
      </Typography>
      <Typography sx={{ fontSize: 11.5, color: R_MUTED, whiteSpace: 'nowrap', flexShrink: 0 }}>
        Step {step + 1} of {steps.length}
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
      {steps.map((label, i) => {
        const done    = i < step;
        const current = i === step;
        return (
          <Box key={label} sx={{ display: 'contents' }}>
            {i > 0 && (
              <Box sx={{
                flex: 1, minWidth: 10, height: 2, borderRadius: 2, mt: '13px',
                bgcolor: i <= step ? R_SAGE : R_TRACK,
                transition: 'background-color .35s ease',
              }} />
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: { xs: 'auto', sm: 82 } }}>
              <Box
                component="button"
                type="button"
                title={label}
                aria-label={`Step ${i + 1}: ${label}`}
                aria-current={current ? 'step' : undefined}
                onClick={() => onStepClick(i)}
                sx={{
                  width: 28, height: 28, p: 0, flexShrink: 0,
                  borderRadius: '50%', cursor: done ? 'pointer' : 'default',
                  fontFamily: 'inherit', fontSize: 12, lineHeight: 1,
                  fontWeight: current ? 700 : 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid',
                  borderColor: done ? R_SAGE : current ? R_INK : R_LINE,
                  bgcolor: done ? R_SAGE : current ? R_INK : 'transparent',
                  color: i <= step ? '#fff' : R_FAINT,
                  boxShadow: current ? `0 0 0 4px ${R_SAGE_WASH}` : 'none',
                  transition: 'background-color .25s ease, border-color .25s ease, color .25s ease, box-shadow .25s ease',
                  '&:hover': done ? { borderColor: R_SAGE_DARK, bgcolor: R_SAGE_DARK } : current ? { bgcolor: R_INK_DEEP } : { borderColor: R_LINE_HOVER },
                  '&:focus-visible': { outline: `2px solid ${R_SAGE}`, outlineOffset: 3 },
                }}
              >
                {i + 1}
              </Box>
              <Typography sx={{
                display: { xs: 'none', sm: 'block' },
                mt: 1, maxWidth: '100%', textAlign: 'center',
                fontSize: 10.5, lineHeight: 1.3, letterSpacing: '0.01em',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                fontWeight: current ? 700 : 500,
                color: current ? R_INK : done ? R_MUTED : R_FAINT,
              }}>
                {label}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  </Box>
);

// Review-step section card (UI only)
const ReviewSection = ({ title, onEdit, rows }) => (
  <Box sx={{ border: `1px solid ${R_LINE}`, borderRadius: 2, p: 1.75, mb: 1.5 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: R_INK }}>{title}</Typography>
      <Button size="small" onClick={onEdit}
        sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 600, color: '#04282B', minWidth: 0, p: 0 }}>
        Edit
      </Button>
    </Box>
    {rows.map(([label, value]) => (
      <Box key={label} sx={{ display: 'flex', gap: 1.5, py: 0.4 }}>
        <Typography sx={{ fontSize: 12, color: R_MUTED, width: 110, flexShrink: 0 }}>{label}</Typography>
        <Typography sx={{ fontSize: 12.5, color: R_INK, wordBreak: 'break-word' }}>{value || '—'}</Typography>
      </Box>
    ))}
  </Box>
);

const InterviewerRegisterForm = ({ onSwitch, inviteToken = '' }) => {
  const [inviteData, setInviteData] = useState(null);   // null = not loaded, false = invalid/expired
  const [inviteLoading, setInviteLoading] = useState(!!inviteToken);

  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    company_id: '', department: '', designation: '', seniority: '',
        skills: [], languages: [], timezone: 'Asia/Kolkata', showOtherSkill: false,
  });
  const [countryIso, setCountryIso] = useState('IN');
  const [fieldErrors, setFieldErrors] = useState({ email: '', phone: '' });
  const [companyOptions, setCompanyOptions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // ── Email OTP verification state ──
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpBusy, setOtpBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  // ── Validate invite token on mount ──
  useEffect(() => {
    if (!inviteToken) return;
    setInviteLoading(true);
    interviewerAuthService.validateInvite(inviteToken)
      .then((res) => {
        const d = res.data;
        setInviteData(d);
        setForm(prev => ({
          ...prev,
          first_name: d.First_Name || '',
          last_name:  d.Last_Name || '',
          email:      d.Email || '',
          company_id: d.Company_Id || '',
        }));
        setCompanyOptions(prev => {
          if (prev.some(c => c.id === d.Company_Id)) return prev;
          return [...prev, { id: d.Company_Id, name: d.Company_Name }];
        });
        // OTP still required — don't pre-verify
      })
      .catch(() => {
        setInviteData(false);
        setError('This invite link is invalid or has expired. Please ask the Company Admin to resend.');
      })
      .finally(() => setInviteLoading(false));
  }, [inviteToken]);

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Live validation for email — show error while typing (but not on empty field)
    if (field === 'email') {
      setFieldErrors(prev => ({
        ...prev,
        email: value ? validateEmail(value) : '',
      }));
      setEmailVerified(false);
      setOtpSent(false);
      setOtp('');
      setOtpError('');
    }
    // Live validation for phone — show error while typing (skip while empty)
    if (field === 'phone') {
      setFieldErrors(prev => ({
        ...prev,
        phone: value ? validatePhone(value, countryIso) : '',
      }));
    }
  };

  const handleRequestOtp = async () => {
    const emailErr = validateEmail(form.email);
    if (emailErr) { setFieldErrors(prev => ({ ...prev, email: emailErr })); return; }
    setOtpBusy(true);
    setOtpError('');
    try {
      await interviewerAuthService.requestEmailOtp(form.email.trim().toLowerCase());
      setOtpSent(true);
      setOtp('');
      setResendIn(300);
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to send code. Please try again.';
      setFieldErrors(prev => ({ ...prev, email: msg }));
    } finally {
      setOtpBusy(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) { setOtpError('Enter the 6-digit code'); return; }
    setOtpBusy(true);
    setOtpError('');
    try {
      await interviewerAuthService.verifyEmailOtp(form.email.trim().toLowerCase(), otp);
      setEmailVerified(true);
      setOtpSent(false);
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Invalid code.';
      setOtpError(msg);
    } finally {
      setOtpBusy(false);
    }
  };

  // Load companies on mount (shows first 50)
  useEffect(() => {
    interviewerAuthService.getCompanies()
      .then(r => setCompanyOptions(r.data.companies || []))
      .catch(() => {});
  }, []);

  // Search companies as user types
  const fetchCompanies = (search) => {
    interviewerAuthService.getCompanies(search)
      .then(r => setCompanyOptions(r.data.companies || []))
      .catch(() => {});
  };

  const isInvite = !!inviteData;

  const canSubmit = form.first_name && form.last_name && form.email && form.phone &&
    emailVerified &&
    form.company_id && form.department && form.designation && form.seniority &&
        form.skills.length > 0 && form.languages.length > 0 &&
        !fieldErrors.email && !fieldErrors.phone;

  // ── Stepper navigation (UI only) ──
  const [step, setStep] = useState(0);

  const personalValid = Boolean(
    form.first_name && form.last_name && form.email && form.phone &&
    !validateEmail(form.email) && !validatePhone(form.phone, countryIso)
  );
  const professionalValid = Boolean(
    form.company_id && form.department && form.designation && form.seniority &&
    form.skills.length > 0 && form.languages.length > 0
  );

  // Step 1 → next step: skip OTP for invite, send code for self-registration
  const goFromPersonal = () => {
    const emailErr = validateEmail(form.email);
    const phoneErr = validatePhone(form.phone, countryIso);
    if (emailErr || phoneErr) {
      setFieldErrors({ email: emailErr, phone: phoneErr });
      return;
    }
    // invite flow also requires OTP
    if (emailVerified) { setStep(2); return; }
    if (!otpSent) handleRequestOtp();
    setStep(1);
  };

  // Rail click: only completed steps are clickable (go back)
  const goToStep = (i) => { if (i < step) setStep(i); };

  // Review-step display values
  const selectedCompany = companyOptions.find(c => c.id === form.company_id);
  const seniorityLabel  = SENIORITY_OPTIONS.find(s => s.value === form.seniority)?.label || form.seniority;

  const navBtnSx = {
    py: 1.1, textTransform: 'none', fontWeight: 700, bgcolor: '#04282B',
    fontSize: '0.92rem', borderRadius: 2, boxShadow: 'none',
    '&:hover': { bgcolor: '#0a3d40', boxShadow: 'none' },
  };
  const backBtnSx = {
    py: 1.1, textTransform: 'none', fontWeight: 600, color: '#04282B',
    fontSize: '0.92rem', borderRadius: 2,
  };

  const handleSubmit = async () => {
    // Run validation before submit
    const emailErr = validateEmail(form.email);
    const phoneErr = validatePhone(form.phone, countryIso);
    if (emailErr || phoneErr) {
      setFieldErrors({ email: emailErr, phone: phoneErr });
      return;
    }
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      const { _showOtherSkill, ...rest } = form;
      const dialCode = getCountry(countryIso).code;
      await interviewerAuthService.register({
        ...rest,
        phone: `${dialCode}${form.phone}`,
        ...(inviteToken ? { invite_token: inviteToken } : {}),
      });
      setSuccess(true);
    } catch (err) {
      const d = err?.response?.data;
      if (d && typeof d === 'object' && !d.message) {
        const msgs = Object.entries(d).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`);
        setError(msgs.join(' | '));
      } else {
        setError(d?.message || d?.detail || 'Registration failed. Please try again.');
      }
    } finally { setSubmitting(false); }
  };

  if (success) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2C2A', mb: 1 }}>Registration Submitted</Typography>
        <Typography variant="body2" sx={{ color: '#888', mb: 3, maxWidth: 400, mx: 'auto', lineHeight: 1.7 }}>
          Your registration has been submitted for review. Two HR reviewers must independently approve your profile before you can activate your account. You will receive an email once approved.
        </Typography>
        <Button onClick={() => onSwitch('login')} sx={{ textTransform: 'none', fontWeight: 600, color: '#04282B' }}>
          Back to Sign In
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography sx={{ fontSize: 26, fontWeight: 700, color: '#2C2C2A', mb: 0.5, letterSpacing: '-0.5px' }}>
        Interviewer Registration
      </Typography>
      <Typography sx={{ fontSize: 13, color: '#888', mb: 3 }}>
        Register as an interviewer on iEvalX. Your details will be reviewed by HR before activation.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      {inviteLoading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress size={28} sx={{ color: '#04282B' }} />
          <Typography sx={{ fontSize: 13, color: '#888', mt: 1.5 }}>Validating invite…</Typography>
        </Box>
      ) : inviteData === false ? null : (<>
      <StepRail steps={STEP_LABELS} step={step} onStepClick={goToStep} />

      <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#2C2C2A', letterSpacing: '-0.3px' }}>
        {STEP_HEADS[step].lead}{' '}
        <Box component="span" sx={{ color: R_SAGE }}>{STEP_HEADS[step].accent}</Box>
        {STEP_HEADS[step].tail ? ` ${STEP_HEADS[step].tail}` : ''}
      </Typography>
      <Typography sx={{ fontSize: 12.5, color: '#888', mb: 2.5 }}>
        {STEP_HEADS[step].sub}
      </Typography>

      <Grid container spacing={2}>
        {/* ── Step 1 · Personal ── */}
        {step === 0 && (<>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth size="small" label="First Name" value={form.first_name} onChange={e => update('first_name', e.target.value)} required disabled={isInvite} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth size="small" label="Last Name" value={form.last_name} onChange={e => update('last_name', e.target.value)} required disabled={isInvite} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth size="small" label="Email" type="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            onBlur={() => { if (form.email) setFieldErrors(prev => ({ ...prev, email: validateEmail(form.email) })); }}
            error={!!fieldErrors.email}
            helperText={isInvite ? 'Pre-filled from invite — cannot be changed' : fieldErrors.email}
            disabled={emailVerified || isInvite}
            required
            slotProps={{
              input: {
                endAdornment: emailVerified ? (
                  <Chip
                    size="small"
                    label="✓ Verified"
                    sx={{
                      bgcolor: '#E1F5EE', color: '#0F6E56',
                      fontWeight: 700, fontSize: '0.7rem',
                      height: 22, mr: -0.5,
                    }}
                  />
                ) : null,
              },
            }}
          />
        </Grid>
        </>)}

        {/* ── Step 2 · Verify Email (self-registration only) ── */}
        {step === 1 && otpSent && !emailVerified && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ bgcolor: '#F1F5EF', border: '1px solid #D9E3D2', borderRadius: 2, p: 1.5 }}>
              <Typography sx={{ fontSize: 12, color: '#273238', mb: 1 }}>
                Enter the 6-digit code sent to <b>{form.email}</b>
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 1 }}>
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <Box
                    key={i}
                    component="input"
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    autoComplete="one-time-code"
                    aria-label={`Digit ${i + 1}`}
                    value={otp[i] || ''}
                    onChange={(e) => {
                      const v = (e.target.value || '').replace(/\D/g, '').slice(0, 1);
                      const arr = otp.padEnd(6, ' ').split('').slice(0, 6);
                      arr[i] = v || ' ';
                      const next = arr.join('').replace(/\s/g, '');
                      setOtp(next);
                      setOtpError('');
                      if (v && i < 5) otpRefs.current[i + 1]?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otp[i] && i > 0) {
                        otpRefs.current[i - 1]?.focus();
                      }
                      if (e.key === 'ArrowLeft' && i > 0) otpRefs.current[i - 1]?.focus();
                      if (e.key === 'ArrowRight' && i < 5) otpRefs.current[i + 1]?.focus();
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
                      if (pasted) {
                        setOtp(pasted);
                        setOtpError('');
                        otpRefs.current[Math.min(pasted.length, 5)]?.focus();
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    sx={{
                      width: 32, height: 38, border: 'none', outline: 'none',
                      borderBottom: `2px solid ${otpError ? '#D9534F' : '#5DCAA5'}`,
                      background: 'transparent', textAlign: 'center',
                      fontSize: 18, fontWeight: 600, color: '#273238',
                      caretColor: '#5DCAA5', transition: 'border-color .2s',
                      '&:focus': { borderBottomColor: otpError ? '#D9534F' : '#0F6E56' },
                    }}
                  />
                ))}
              </Box>
              {otpError && (
                <Typography sx={{ fontSize: 11, color: '#D9534F', textAlign: 'center', mb: 1 }}>
                  {otpError}
                </Typography>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  size="small"
                  onClick={handleRequestOtp}
                  disabled={resendIn > 0 || otpBusy}
                  sx={{
                    textTransform: 'none', fontSize: '0.72rem', fontWeight: 600,
                    color: resendIn > 0 ? '#999' : '#04282B', p: 0, minWidth: 0,
                  }}
                >
                  {resendIn > 0
                    ? `Resend in ${Math.floor(resendIn / 60)}:${String(resendIn % 60).padStart(2, '0')}`
                    : 'Resend code'}
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleVerifyOtp}
                  disabled={otp.length !== 6 || otpBusy}
                  sx={{
                    textTransform: 'none', fontSize: '0.72rem', fontWeight: 700,
                    bgcolor: '#04282B', px: 2, py: 0.5, boxShadow: 'none',
                    '&:hover': { bgcolor: '#0a3d40', boxShadow: 'none' },
                  }}
                >
                  {otpBusy ? <CircularProgress size={12} sx={{ color: '#fff' }} /> : 'Verify code'}
                </Button>
              </Box>
            </Box>
          </Grid>
        )}
        {step === 1 && !otpSent && !emailVerified && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              {otpBusy ? (
                <>
                  <CircularProgress size={22} sx={{ color: '#04282B' }} />
                  <Typography sx={{ fontSize: 12, color: '#888', mt: 1 }}>
                    Sending code to <b>{form.email}</b>…
                  </Typography>
                </>
              ) : (
                <>
                  {fieldErrors.email && (
                    <Alert severity="error" sx={{ mb: 1.5, borderRadius: 2, textAlign: 'left' }}>{fieldErrors.email}</Alert>
                  )}
                  <Button onClick={handleRequestOtp}
                    sx={{ textTransform: 'none', fontWeight: 600, color: '#04282B' }}>
                    Send code to {form.email}
                  </Button>
                </>
              )}
            </Box>
          </Grid>
        )}
        {step === 1 && emailVerified && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ bgcolor: '#E1F5EE', border: '1px solid #BFE6D6', borderRadius: 2, p: 2, textAlign: 'center' }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0F6E56' }}>✓ Email verified</Typography>
              <Typography sx={{ fontSize: 12, color: '#0F6E56', mt: 0.5 }}>{form.email}</Typography>
            </Box>
          </Grid>
        )}

        {/* ── Step 1 · Personal (phone) ── */}
        {step === 0 && (
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth size="small" label="Phone"
            value={form.phone}
            onChange={e => {
              const raw = e.target.value.replace(/[^\d]/g, '').slice(0, 15);
              update('phone', raw);
            }}
            onBlur={() => { if (form.phone) setFieldErrors(prev => ({ ...prev, phone: validatePhone(form.phone, countryIso) })); }}
            error={!!fieldErrors.phone}
            helperText={fieldErrors.phone || `e.g. ${phoneExample(countryIso) || '9876543210'}`}
            required
            placeholder={phoneExample(countryIso) || '9876543210'}
            slotProps={{
              input: {
                startAdornment: (
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 0.5 }}>
                    <TextField
                      select size="small" variant="standard"
                      value={countryIso}
                      onChange={(e) => {
                        const iso = e.target.value;
                        setCountryIso(iso);
                        setFieldErrors(prev => ({
                          ...prev,
                          phone: form.phone ? validatePhone(form.phone, iso) : '',
                        }));
                      }}
                      sx={{
                        minWidth: 80, '& .MuiInput-underline:before': { border: 'none' },
                        '& .MuiInput-underline:after': { border: 'none' },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { border: 'none' },
                        '& .MuiSelect-select': { fontSize: '0.85rem', py: 0, pr: '20px !important' },
                      }}
                      slotProps={{
                        select: {
                          MenuProps: {
                            anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                            transformOrigin: { vertical: 'top', horizontal: 'left' },
                            slotProps: { paper: { sx: { maxHeight: 250, mt: 1.5 } } },
                          },
                        },
                      }}
                    >
                      {COUNTRY_CODES.map(c => (
                        <MenuItem key={c.value} value={c.value} sx={{ fontSize: '0.82rem' }}>
                          {c.code} {c.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                ),
              },
            }}
          />
        </Grid>
        )}

        {/* ── Step 3 · Professional ── */}
        {step === 2 && (<>
        <Grid size={{ xs: 12 }}>
          <Autocomplete
            options={companyOptions}
            getOptionLabel={(opt) => typeof opt === 'string' ? opt : (opt.name || '')}
            isOptionEqualToValue={(opt, val) => opt.id === val.id}
            value={companyOptions.find(c => c.id === form.company_id) || null}
            onChange={(_, v) => update('company_id', v ? v.id : '')}
            onInputChange={(_, v, reason) => { if (reason === 'input' && v.length >= 2) fetchCompanies(v); }}
            disabled={isInvite}
            renderInput={(params) => <TextField {...params} size="small" label="Company" placeholder="Search your company..." required helperText={isInvite ? 'Set by invite' : ''} />}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth size="small" label="Department" value={form.department} onChange={e => update('department', e.target.value)} required />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth size="small" label="Job Role / Designation" value={form.designation} onChange={e => update('designation', e.target.value)} required />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField select fullWidth size="small" label="Seniority" value={form.seniority} onChange={e => update('seniority', e.target.value)} required>
            {SENIORITY_OPTIONS.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField select fullWidth size="small" label="Timezone" value={form.timezone} onChange={e => update('timezone', e.target.value)}>
            {TIMEZONE_OPTIONS.map(tz => <MenuItem key={tz} value={tz}>{tz}</MenuItem>)}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Autocomplete multiple freeSolo disableCloseOnSelect options={[...SKILL_OPTIONS, 'Other']} value={form.skills} onChange={(_, v) => {
            if (v.includes('Other') && !form.showOtherSkill) { update('showOtherSkill', true); update('skills', v.filter(s => s !== 'Other')); }
            else { update('skills', v); }
          }}
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option}>
                <Checkbox size="small" checked={selected} sx={{ mr: 1 }} />
                {option}
              </li>
            )}
            renderTags={(val, getProps) => val.map((opt, i) => <Chip key={i} label={opt} size="small" {...getProps({ index: i })} sx={{ bgcolor: '#F5F5F5' }} />)}
            renderInput={(params) => <TextField {...params} size="small" label="Technical Skills" placeholder="Add skills..." required />} />
          {form.showOtherSkill && (
            <TextField fullWidth size="small" label="Enter your skill" placeholder="Type a skill and press Enter" sx={{ mt: 1 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  e.preventDefault();
                  update('skills', [...form.skills, e.target.value.trim()]);
                  e.target.value = '';
                  update('showOtherSkill', false);
                }
              }} />
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Autocomplete
            multiple
            disableCloseOnSelect
            options={LANGUAGE_OPTIONS}
            value={form.languages}
            onChange={(_, v) => update('languages', v)}
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option}>
                <Checkbox size="small" checked={selected} sx={{ mr: 1 }} />
                {option}
              </li>
            )}
            renderTags={(val, getProps) => val.map((opt, i) => <Chip key={i} label={opt} size="small" {...getProps({ index: i })} sx={{ bgcolor: '#F5F5F5' }} />)}
            renderInput={(params) => <TextField {...params} size="small" label="Languages" placeholder="Select languages..." required />}
          />
        </Grid>
        </>)}
      </Grid>

      {/* ── Step 1 · Continue ── */}
      {step === 0 && (
        <Button fullWidth variant="contained" disabled={!personalValid || otpBusy} onClick={goFromPersonal}
          sx={{ mt: 3, ...navBtnSx }}>
          {otpBusy ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Continue'}
        </Button>
      )}

      {/* ── Step 2 · Back / Continue ── */}
      {step === 1 && (
        <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
          <Button onClick={() => setStep(0)} sx={{ flex: 1, ...backBtnSx }}>Back</Button>
          <Button variant="contained" disabled={!emailVerified} onClick={() => setStep(2)}
            sx={{ flex: 2, ...navBtnSx }}>
            Continue
          </Button>
        </Box>
      )}

      {/* ── Professional · Back / Continue ── */}
      {step === 2 && (
        <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
          <Button onClick={() => setStep(1)} sx={{ flex: 1, ...backBtnSx }}>Back</Button>
          <Button variant="contained" disabled={!professionalValid} onClick={() => setStep(3)}
            sx={{ flex: 2, ...navBtnSx }}>
            Continue
          </Button>
        </Box>
      )}

      {/* ── Review + Submit ── */}
      {step === 3 && (
        <>
          <ReviewSection title="Personal" onEdit={() => setStep(0)} rows={[
            ['Name',  `${form.first_name} ${form.last_name}`.trim()],
            ['Email', emailVerified ? `${form.email}  ✓ Verified` : form.email],
            ['Phone', form.phone ? `${getCountry(countryIso).code} ${form.phone}` : ''],
          ]} />
          <ReviewSection title="Work details" onEdit={() => setStep(2)} rows={[
            ['Company',     selectedCompany?.name],
            ['Department',  form.department],
            ['Designation', form.designation],
            ['Seniority',   seniorityLabel],
            ['Timezone',    form.timezone],
          ]} />
          <ReviewSection title="Expertise" onEdit={() => setStep(2)} rows={[
            ['Skills',    form.skills.join(', ')],
            ['Languages', form.languages.join(', ')],
          ]} />
          <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
            <Button onClick={() => setStep(2)} sx={{ flex: 1, ...backBtnSx }}>Back</Button>
            <Button variant="contained" disabled={!canSubmit || submitting} onClick={handleSubmit}
              sx={{ flex: 2, ...navBtnSx }}>
              {submitting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Submit Registration'}
            </Button>
          </Box>
        </>
      )}
      </>)}
    </Box>
  );
};

export default InterviewerRegisterForm;