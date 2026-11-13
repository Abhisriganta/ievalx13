import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Alert, Skeleton,
  Drawer, IconButton, InputAdornment,
} from '@mui/material';
import { Send, Refresh, Add, Close, Search, PersonAddAlt1, MailOutlined } from '@mui/icons-material';
import { interviewerAuthService } from '@/services/api/iaem';

// App palette (pine / sage) — matches the dashboard, not the legacy blue theme
const C = {
  pine: '#04282B', pineHover: '#0A3D40', sage: '#7F9E7E', sageDark: '#4F6F53',
  sageSoft: '#EDF3EC', line: '#E7EAE3', lineStrong: '#CDD4CC', cream: '#F6F8F3',
  ink: '#1F2421', muted: '#5F6661',
};
const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px', backgroundColor: '#FFFFFF', fontSize: '0.92rem',
    '& fieldset': { borderColor: C.line, borderWidth: '1px' },
    '&:hover fieldset': { borderColor: C.lineStrong },
    '&.Mui-focused fieldset': { borderColor: C.sageDark, borderWidth: '1.5px' },
  },
  '& .MuiOutlinedInput-input': { py: 1.5 },
};
const FieldLabel = ({ htmlFor, children }) => (
  <Typography component="label" htmlFor={htmlFor}
    sx={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: C.ink, mb: 0.75 }}>
    {children} <Box component="span" sx={{ color: '#B3261E' }}>*</Box>
  </Typography>
);

const StatusChip = ({ status }) => {
  const map = {
    PENDING:  { label: 'Pending',  bg: '#FFF3E0', color: '#E65100' },
    ACCEPTED: { label: 'Accepted', bg: '#E8F5E9', color: '#2E7D32' },
    EXPIRED:  { label: 'Expired',  bg: '#FAFAFA', color: '#9E9E9E' },
  };
  const s = map[status] || map.PENDING;
  return <Chip label={s.label} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700, fontSize: '0.72rem', borderRadius: '8px', height: 24 }} />;
};

const CompanyInterviewers = () => {
  // ── Invite form ──
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ── Invite list ──
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Option C UI state ──
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const loadInvites = () => {
    setLoading(true);
    interviewerAuthService.listInvites()
      .then((res) => setInvites(res.data?.Invites || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadInvites(); }, []);

  const handleSend = async () => {
    const { first_name, last_name, email } = form;
    if (!first_name.trim() || !last_name.trim() || !email.trim()) {
      setError('All fields are required.');
      return;
    }
    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    setSending(true);
    setError('');
    setSuccess('');
    try {
      const res = await interviewerAuthService.sendInvite({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: email.trim().toLowerCase(),
      });
      setSuccess(`Invite sent to ${res.data?.Email || email}`);
      setForm({ first_name: '', last_name: '', email: '' });
      setDrawerOpen(false);
      loadInvites();
    } catch (err) {
      const msg = err?.response?.data?.Error || err?.response?.data?.detail || 'Failed to send invite.';
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  const fmtDate = (d) => {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return d; }
  };

  // ── Option C helpers ──
  const FILTERS = [
    { key: 'ALL', label: 'All' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'ACCEPTED', label: 'Accepted' },
    { key: 'EXPIRED', label: 'Expired' },
  ];
  const countFor = (key) => (key === 'ALL' ? invites.length : invites.filter((i) => i.status === key).length);

  const q = search.trim().toLowerCase();
  const visibleInvites = invites.filter((inv) => {
    if (filter !== 'ALL' && inv.status !== filter) return false;
    if (!q) return true;
    return `${inv.first_name} ${inv.last_name}`.toLowerCase().includes(q) || (inv.email || '').toLowerCase().includes(q);
  });

  const validity = (inv) => {
    if (inv.status === 'ACCEPTED') return { pct: 100, color: '#2E8B47' };
    if (inv.status === 'EXPIRED') return { pct: 100, color: '#9AA09B' };
    const start = new Date(inv.created_at).getTime();
    const end = new Date(inv.expires_at).getTime();
    if (!start || !end || end <= start) return { pct: 0, color: '#C98A1A' };
    const pct = Math.min(100, Math.max(0, ((Date.now() - start) / (end - start)) * 100));
    return { pct, color: '#C98A1A' };
  };

  const openDrawer = () => { setError(''); setSuccess(''); setDrawerOpen(true); };

  const headCellSx = {
    backgroundColor: '#FAFBF8 !important', color: '#5F6661 !important',
    fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', py: 1.5,
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1180, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2.75 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.5px', color: '#1F2421' }}>Interviewers</Typography>
          <Typography sx={{ fontSize: '0.9rem', color: '#5F6661', mt: 0.5 }}>
            Everyone you've invited to interview for your company.
          </Typography>
        </Box>
        <Button
          variant="contained" startIcon={<Add />} onClick={openDrawer}
          sx={{
            textTransform: 'none', fontWeight: 700, bgcolor: '#04282B', borderRadius: '12px',
            px: 2.5, height: 46, boxShadow: 'none', '&:hover': { bgcolor: '#0a3d40', boxShadow: 'none' },
          }}
        >
          Invite interviewer
        </Button>
      </Box>

      {success && <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

      {/* Status filter chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mb: 2.75 }}>
        {FILTERS.map((f) => {
          const on = filter === f.key;
          return (
            <Button
              key={f.key} onClick={() => setFilter(f.key)} aria-pressed={on}
              sx={{
                textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', borderRadius: '999px', height: 40, px: 1.75, gap: 1,
                bgcolor: on ? '#04282B' : '#FFFFFF', color: on ? '#FFFFFF' : '#3E4440',
                border: `1px solid ${on ? '#04282B' : '#DDE1D9'}`,
                '&:hover': { bgcolor: on ? '#0a3d40' : '#F4F5F0' },
              }}
            >
              {f.label}
              <Box component="span" sx={{
                fontSize: '0.75rem', fontWeight: 700, borderRadius: '999px', px: 1, py: '1px',
                bgcolor: on ? '#B7D3B9' : '#EFF1EC', color: on ? '#04282B' : '#3E4440',
              }}>
                {countFor(f.key)}
              </Box>
            </Button>
          );
        })}
      </Box>

      {/* Invite table */}
      <Paper elevation={0} sx={{ borderRadius: '18px', border: '1px solid #E3E6DF', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2, borderBottom: '1px solid #ECEEE8' }}>
          <TextField
            size="small" placeholder="Search by name or email" value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              htmlInput: { 'aria-label': 'Search invites' },
              input: { startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: C.muted }} /></InputAdornment> },
            }}
            sx={{ flex: '0 1 320px', ...fieldSx, '& .MuiOutlinedInput-input': { py: 1.1 } }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '0.82rem', color: '#5F6661' }}>Showing {visibleInvites.length} invites</Typography>
            <Button size="small" startIcon={<Refresh />} onClick={loadInvites}
              sx={{ textTransform: 'none', fontWeight: 600, color: '#04282B' }}>
              Refresh
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ p: 3 }}>{[1, 2, 3].map((i) => <Skeleton key={i} height={48} sx={{ mb: 1, borderRadius: 2 }} />)}</Box>
        ) : visibleInvites.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6, color: '#5F6661', fontSize: '0.9rem' }}>
            {invites.length === 0 ? 'No invites sent yet. Click "Invite interviewer" to send the first one.' : 'No invites match this filter.'}
          </Box>
        ) : (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 720, '& .MuiTableCell-root': { borderBottom: '1px solid #ECEEE8 !important' } }}>
              <TableHead>
                <TableRow sx={{ '& .MuiTableCell-head': headCellSx }}>
                  <TableCell sx={{ pl: 2.5 }}>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Link validity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleInvites.map((inv) => {
                  const v = validity(inv);
                  return (
                    <TableRow key={inv.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell sx={{ pl: 2.5, py: 2 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#1F2421' }}>
                          {inv.first_name} {inv.last_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.86rem', color: '#3E4440' }}>{inv.email}</Typography>
                      </TableCell>
                      <TableCell><StatusChip status={inv.status} /></TableCell>
                      <TableCell>
                        <Box sx={{ width: 190 }}>
                          <Typography sx={{ fontSize: '0.8rem', color: '#3E4440', mb: 0.75 }}>
                            {fmtDate(inv.created_at)} → {fmtDate(inv.expires_at)}
                          </Typography>
                          <Box aria-hidden sx={{ height: 5, borderRadius: '999px', bgcolor: '#EDEFEA', overflow: 'hidden' }}>
                            <Box sx={{ height: '100%', width: `${v.pct}%`, bgcolor: v.color, borderRadius: '999px' }} />
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Invite drawer */}
      <Drawer
        anchor="right" open={drawerOpen} onClose={() => !sending && setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: '100%', sm: 440 }, bgcolor: '#FFFFFF', color: C.ink,
              borderRadius: { xs: 0, sm: '20px 0 0 20px' }, boxShadow: '-16px 0 40px rgba(4, 40, 43, 0.12)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            },
          },
          backdrop: { sx: { bgcolor: 'rgba(4, 40, 43, 0.35)' } },
        }}
      >
        {/* Header */}
        <Box sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'flex-start', gap: 1.75 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: C.sageSoft, color: C.pine, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <PersonAddAlt1 sx={{ fontSize: 22 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: C.ink, lineHeight: 1.3 }}>Invite an interviewer</Typography>
            <Typography sx={{ fontSize: '0.84rem', color: C.muted, mt: 0.5, lineHeight: 1.5 }}>
              We'll email them a personal registration link, valid for 7 days.
            </Typography>
          </Box>
          <IconButton aria-label="Close" onClick={() => setDrawerOpen(false)} disabled={sending}
            sx={{ width: 36, height: 36, borderRadius: '10px', color: C.muted, border: `1px solid ${C.line}`, '&:hover': { bgcolor: C.cream } }}>
            <Close sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {error && <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <FieldLabel htmlFor="inv-first">First name</FieldLabel>
              <TextField
                id="inv-first" fullWidth placeholder="Priya"
                value={form.first_name}
                onChange={(e) => setForm(prev => ({ ...prev, first_name: e.target.value }))}
                sx={fieldSx}
              />
            </Box>
            <Box>
              <FieldLabel htmlFor="inv-last">Last name</FieldLabel>
              <TextField
                id="inv-last" fullWidth placeholder="Sharma"
                value={form.last_name}
                onChange={(e) => setForm(prev => ({ ...prev, last_name: e.target.value }))}
                sx={fieldSx}
              />
            </Box>
          </Box>

          <Box>
            <FieldLabel htmlFor="inv-email">Work email</FieldLabel>
            <TextField
              id="inv-email" type="email" fullWidth placeholder="name@company.com"
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><MailOutlined sx={{ fontSize: 18, color: C.muted }} /></InputAdornment> } }}
              sx={fieldSx}
            />
          </Box>

          <Box sx={{ bgcolor: C.cream, border: `1px solid ${C.line}`, borderRadius: '14px', p: 2.25 }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.sageDark, mb: 1.5 }}>
              What happens next
            </Typography>
            {[
              'They open the link in the invite email',
              'They complete the registration form',
              'Two HR reviewers approve the profile',
              'Their interviewer account is activated',
            ].map((step, i) => (
              <Box key={step} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, '& + &': { mt: 1.25 } }}>
                <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: C.pine, color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {i + 1}
                </Box>
                <Typography sx={{ fontSize: '0.86rem', color: C.ink }}>{step}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${C.line}`, bgcolor: C.cream, display: 'flex', gap: 1.25 }}>
          <Button
            onClick={() => setDrawerOpen(false)} disabled={sending}
            sx={{ flex: 1, height: 46, textTransform: 'none', fontWeight: 600, fontSize: '0.9rem', color: C.ink, bgcolor: '#FFFFFF', border: `1px solid ${C.lineStrong}`, borderRadius: '12px', '&:hover': { bgcolor: '#FFFFFF', borderColor: C.sage } }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={sending ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <Send sx={{ fontSize: 18 }} />}
            disabled={sending}
            onClick={handleSend}
            sx={{
              flex: 2, height: 46, textTransform: 'none', fontWeight: 700, fontSize: '0.9rem', bgcolor: C.pine, color: '#FFFFFF',
              borderRadius: '12px', boxShadow: 'none', '&:hover': { bgcolor: C.pineHover, boxShadow: 'none' },
              '&.Mui-disabled': { bgcolor: C.pine, color: 'rgba(255,255,255,0.75)' },
            }}
          >
            {sending ? 'Sending…' : 'Send invite'}
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default CompanyInterviewers;