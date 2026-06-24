import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, History, LogOut, Plus, Trash2, Printer, Save, DollarSign, Calendar, TrendingUp, Truck } from 'lucide-react';

// Custom SVG Logo for SVAT matching the red crescent-shaped truck logo with TM trademark
const SVATLogo = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    border: '1.5px solid #000000', 
    borderRadius: '6px', 
    padding: '4px', 
    width: '105px', 
    height: '105px', 
    backgroundColor: '#FFFFFF', 
    flexShrink: 0,
    position: 'relative'
  }}>
    {/* Small TM mark in the top-right of the logo box */}
    <span style={{
      position: 'absolute',
      top: '3px',
      right: '6px',
      fontSize: '0.55rem',
      fontWeight: '900',
      color: '#E53935'
    }}>TM</span>

    <img 
      src="/logo.png" 
      alt="SVAT Logo" 
      style={{ 
        width: '95px', 
        height: '95px', 
        objectFit: 'contain',
        filter: 'brightness(1.2) contrast(1.1) saturate(1.15)'
      }} 
    />
  </div>
);

// Indian Numbering System to Words conversion helper
const numberToWords = (num) => {
  const integerPart = Math.floor(num);
  if (integerPart === 0) return 'INR ZERO ONLY';
  
  const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
  const b = ['', '', 'twenty ', 'thirty ', 'forty ', 'fifty ', 'sixty ', 'seventy ', 'eighty ', 'ninety '];
  
  const formatWord = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + a[n % 10];
    if (n < 1000) return a[Math.floor(n / 100)] + 'hundred ' + (n % 100 !== 0 ? 'and ' + formatWord(n % 100) : '');
    if (n < 100000) return formatWord(Math.floor(n / 1000)) + 'thousand ' + (n % 1000 !== 0 ? formatWord(n % 1000) : '');
    if (n < 10000000) return formatWord(Math.floor(n / 100000)) + 'lakh ' + (n % 100000 !== 0 ? formatWord(n % 100000) : '');
    return formatWord(Math.floor(n / 10000000)) + 'crore ' + (n % 10000000 !== 0 ? formatWord(n % 10000000) : '');
  };

  const words = formatWord(integerPart);
  return 'INR ' + words.trim().replace(/\s+/g, ' ').toUpperCase() + ' ONLY';
};

// Autocomplete suggestions dropdown element
const SuggestionsDropdown = ({ query, list, onSelect, onClose }) => {
  const filtered = list.filter(val => 
    val.toLowerCase().includes((query || '').toLowerCase()) && val.toLowerCase() !== (query || '').toLowerCase()
  );

  useEffect(() => {
    const handleOutsideClick = () => {
      setTimeout(onClose, 200);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [onClose]);

  if (filtered.length === 0) return null;

  return (
    <ul style={{
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: '#1E2330',
      border: '1px solid #262D3D',
      borderRadius: '6px',
      maxHeight: '150px',
      overflowY: 'auto',
      zIndex: 50,
      listStyle: 'none',
      margin: 0,
      padding: 0,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
    }}>
      {filtered.map((val, idx) => (
        <li 
          key={idx}
          style={{
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            color: '#E2E8F0',
            borderBottom: '1px solid #262D3D',
            transition: 'background-color 0.2s'
          }}
          onMouseDown={(e) => {
            e.preventDefault(); // Prevents textbox blur from closing this list prematurely
            onSelect(val);
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(241, 180, 0, 0.15)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          {val}
        </li>
      ))}
    </ul>
  );
};

const DEFAULT_INVOICE = {
  companyName: 'SREE VAARAHI AMMAN TRANSPORTS',
  companyAddress: 'NO: 228/1 RAKKIYAPALAYAM, AVINASHI, TIRUPUR - 641654',
  companyGst: '33AVDPTS410D1Z0',
  companyState: 'Tamil Nadu, Code: 33',
  companyEmail: 'varahitpt104@gmail.com',
  companyWebsite: 'www.sreevaarahiammantransports.com',
  debitNoteNo: '',
  date: '',
  originalInvoiceNo: '',
  originalInvoiceDate: '',
  otherRefs: '',
  consigneeName: '',
  consigneeAddress: '',
  consigneeGst: '',
  consigneeState: '',
  consigneeEmail: '',
  vesselFlightNo: '',
  placeOfReceipt: '',
  portOfLoading: '',
  portOfDischarge: '',
  ctns: '',
  cbm: '',
  weight: '',
  items: [
    { particulars: '', quantity: '', rate: '', per: '', amount: '' }
  ],
  bankName: 'BANK OF BARODA',
  bankAccount: '18930200002289',
  bankBranch: 'TIRUPPUR MAIN & BARB0COTTON',
  bankHolderName: 'SREE VAARAHI AMMAN TRANSPORTS',
  signatoryName: 'P. SARANYA',
  roundOff: '',
  gstCategory: 'exempted',
  wordsOverride: ''
};

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('creator');
  const [formData, setFormData] = useState(DEFAULT_INVOICE);
  const [invoices, setInvoices] = useState([
    {
      id: 'SVAT/DN/26-27/13',
      consignee: 'NEW SABARI SASTHA SHIPPING SERVICES',
      date: '30-April-26',
      amount: 62000,
      status: 'paid'
    },
    {
      id: 'SVAT/DN/26-27/12',
      consignee: 'NEW SABARI SASTHA SHIPPING SERVICES',
      date: '15-April-26',
      amount: 45000,
      status: 'paid'
    }
  ]);

  const [subtotal, setSubtotal] = useState(0);
  const [cgstAmount, setCgstAmount] = useState(0);
  const [sgstAmount, setSgstAmount] = useState(0);
  const [igstAmount, setIgstAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [amountInWords, setAmountInWords] = useState('');

  // Autocomplete Particulars suggestion state
  const [suggestions, setSuggestions] = useState(() => {
    const saved = localStorage.getItem('svat_particulars_suggestions');
    return saved ? JSON.parse(saved) : [
      "VEHICLE HIRING CHARGES",
      "HALTING CHARGES",
      "HALTING CHARGES (2 DAYS)",
      "CONTAINER HANDLING CHARGES",
      "TRANSPORTATION CHARGES",
      "CONTAINER LOADING CHARGES",
      "PORT OUT FLOW CHARGES"
    ];
  });
  const [activeRowIdx, setActiveRowIdx] = useState(null);

  // Re-calculate totals, GST, and words dynamically (sanitizing commas/symbols)
  useEffect(() => {
    const calculatedSubtotal = formData.items.reduce((acc, item) => {
      const cleanAmtStr = (item.amount || '').toString().replace(/[^0-9.]/g, '');
      if (cleanAmtStr !== '') {
        return acc + (parseFloat(cleanAmtStr) || 0);
      }
      const cleanQtyStr = (item.quantity || '').toString().replace(/[^0-9.]/g, '');
      const cleanRateStr = (item.rate || '').toString().replace(/[^0-9.]/g, '');
      const q = parseFloat(cleanQtyStr) || 0;
      const r = parseFloat(cleanRateStr) || 0;
      return acc + (q * r);
    }, 0);
    
    setSubtotal(calculatedSubtotal);

    let cgstRate = 0;
    let sgstRate = 0;
    let igstRate = 0;
    const roundOff = parseFloat(formData.roundOff) || 0;

    if (formData.gstCategory === 'rcm' || formData.gstCategory === 'forward_5') {
      cgstRate = 2.5;
      sgstRate = 2.5;
    } else if (formData.gstCategory === 'forward_18') {
      cgstRate = 9;
      sgstRate = 9;
    }

    const cgst = (calculatedSubtotal * cgstRate) / 100;
    const sgst = (calculatedSubtotal * sgstRate) / 100;
    const igst = (calculatedSubtotal * igstRate) / 100;
    
    // For RCM or Exempted, the GST amounts are shown on invoice but NOT added to payable Grand Total.
    const isRcmOrExempt = formData.gstCategory === 'rcm' || formData.gstCategory === 'exempted';
    const grandTotal = isRcmOrExempt 
      ? calculatedSubtotal + roundOff 
      : calculatedSubtotal + cgst + sgst + igst + roundOff;

    setCgstAmount(cgst);
    setSgstAmount(sgst);
    setIgstAmount(igst);
    setTotalAmount(grandTotal);

    if (!formData.wordsOverride) {
      setAmountInWords(numberToWords(grandTotal));
    } else {
      setAmountInWords(formData.wordsOverride);
    }
  }, [formData.items, formData.wordsOverride, formData.roundOff, formData.gstCategory]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearForm = () => {
    setFormData(prev => ({
      ...prev,
      debitNoteNo: '',
      date: '',
      originalInvoiceNo: '',
      originalInvoiceDate: '',
      otherRefs: '',
      consigneeName: '',
      consigneeAddress: '',
      consigneeGst: '',
      consigneeState: '',
      consigneeEmail: '',
      vesselFlightNo: '',
      placeOfReceipt: '',
      portOfLoading: '',
      portOfDischarge: '',
      ctns: '',
      cbm: '',
      weight: '',
      items: [
        { particulars: '', quantity: '', rate: '', per: '', amount: '' }
      ],
      roundOff: '',
      gstCategory: 'exempted',
      wordsOverride: ''
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    
    // Automatically calculate amount in form row when Qty or Rate changes
    if (field === 'quantity' || field === 'rate') {
      const qStr = field === 'quantity' ? value : newItems[index].quantity;
      const rStr = field === 'rate' ? value : newItems[index].rate;
      const qClean = (qStr || '').toString().replace(/[^0-9.]/g, '');
      const rClean = (rStr || '').toString().replace(/[^0-9.]/g, '');
      const q = parseFloat(qClean) || 0;
      const r = parseFloat(rClean) || 0;
      if (q > 0 && r > 0) {
        newItems[index].amount = (q * r).toString();
      }
    }
    
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItemRow = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { particulars: '', quantity: '', rate: '', per: '', amount: '' }]
    }));
  };

  const removeItemRow = (index) => {
    if (formData.items.length <= 1) return;
    const newItems = formData.items.filter((_, idx) => idx !== index);
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const handleSaveInvoice = () => {
    const newInvoiceObj = {
      id: formData.debitNoteNo || `DN-${Date.now().toString().slice(-5)}`,
      consignee: formData.consigneeName,
      date: formData.date,
      amount: totalAmount,
      status: 'pending'
    };
    
    if (invoices.some(inv => inv.id === newInvoiceObj.id)) {
      setInvoices(prev => prev.map(inv => inv.id === newInvoiceObj.id ? newInvoiceObj : inv));
    } else {
      setInvoices(prev => [newInvoiceObj, ...prev]);
    }

    // Save newly entered particulars to suggestion list auto-complete
    const updatedSuggestions = [...suggestions];
    let suggestionsChanged = false;
    formData.items.forEach(item => {
      const p = (item.particulars || '').trim();
      if (p && !updatedSuggestions.includes(p)) {
        updatedSuggestions.push(p);
        suggestionsChanged = true;
      }
    });
    if (suggestionsChanged) {
      setSuggestions(updatedSuggestions);
      localStorage.setItem('svat_particulars_suggestions', JSON.stringify(updatedSuggestions));
    }

    alert('Invoice saved successfully to history!');
  };

  const handleDownloadPDF = () => {
    const element = document.querySelector('.invoice-preview-card');
    if (!element) return;

    // Replace slashes with underscores for safe filename
    const filename = `${(formData.debitNoteNo || 'invoice').replace(/\//g, '_')}.pdf`;
    
    const opt = {
      margin:       0.15,
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    window.html2pdf().set(opt).from(element).save();
  };

  const handleLoadInvoice = (historyItem) => {
    setFormData(prev => ({
      ...prev,
      debitNoteNo: historyItem.id,
      date: historyItem.date,
      items: [
        { particulars: 'VEHICLE HIRING CHARGES', quantity: '', rate: '', per: '', amount: historyItem.amount }
      ],
      roundOff: '',
      gstCategory: 'exempted',
      wordsOverride: ''
    }));
    setActiveTab('creator');
  };

  // Determine Title based on GST tax category
  const billTitle = formData.gstCategory !== 'exempted' ? "Tax Invoice" : "Bill Of Supply";
  const displayCgstRate = (formData.gstCategory === 'rcm' || formData.gstCategory === 'forward_5') ? 2.5 : (formData.gstCategory === 'forward_18' ? 9 : 0);
  const displaySgstRate = (formData.gstCategory === 'rcm' || formData.gstCategory === 'forward_5') ? 2.5 : (formData.gstCategory === 'forward_18' ? 9 : 0);

  return (
    <div className="dashboard-layout">
      {/* Mobile Top Header */}
      <div className="mobile-dashboard-header">
        <div className="logo-container" style={{ fontSize: '1.2rem' }}>
          <Truck className="logo-icon" style={{ width: '24px', height: '24px' }} />
          <span className="logo-text">SVAT</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>munik</span>
          <div className="user-avatar-mobile">M</div>
        </div>
      </div>

      {/* Sidebar Panel */}
      <aside className="sidebar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
            <FileText size={24} />
            <span>PORTAL</span>
          </div>
          
          <nav className="sidebar-menu">
            <li className="sidebar-item">
              <button 
                className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <LayoutDashboard className="sidebar-icon" />
                Overview
              </button>
            </li>
            <li className="sidebar-item">
              <button 
                className={`sidebar-link ${activeTab === 'creator' ? 'active' : ''}`}
                onClick={() => setActiveTab('creator')}
              >
                <FileText className="sidebar-icon" />
                Invoice Creator
              </button>
            </li>
            <li className="sidebar-item">
              <button 
                className={`sidebar-link ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                <History className="sidebar-icon" />
                Invoice History
              </button>
            </li>
          </nav>
        </div>

        <div className="sidebar-user">
          <div className="user-info">
            <div className="user-avatar">M</div>
            <div className="user-details">
              <p className="user-name">munik</p>
              <p className="user-role">Billing Manager</p>
            </div>
          </div>
          <button onClick={onLogout} className="btn-logout" title="Sign Out">
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="dashboard-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="dashboard-header">
              <h2 className="dashboard-title">Dashboard Overview</h2>
            </div>
            
            <div className="overview-grid">
              <div className="overview-card">
                <div className="overview-card-info">
                  <p className="overview-card-label">Total Invoiced</p>
                  <p className="overview-card-value">₹{(invoices.reduce((a, b) => a + b.amount, 0)).toLocaleString()}</p>
                </div>
                <div className="overview-card-icon">
                  <DollarSign size={24} />
                </div>
              </div>
              
              <div className="overview-card">
                <div className="overview-card-info">
                  <p className="overview-card-label">Invoices Count</p>
                  <p className="overview-card-value">{invoices.length}</p>
                </div>
                <div className="overview-card-icon">
                  <FileText size={24} />
                </div>
              </div>

              <div className="overview-card">
                <div className="overview-card-info">
                  <p className="overview-card-label">System Status</p>
                  <p className="overview-card-value" style={{ color: '#4ADE80', fontSize: '1.25rem' }}>Active</p>
                </div>
                <div className="overview-card-icon">
                  <TrendingUp size={24} />
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'left', backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Quick Actions</h3>
              <div className="quick-actions-row">
                <button className="btn-primary" onClick={() => { handleClearForm(); setActiveTab('creator'); }}>
                  Create New Invoice
                </button>
                <button className="btn-outline" onClick={() => setActiveTab('history')}>
                  View Invoices List
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Creator Tab */}
        {activeTab === 'creator' && (
          <div>
            <div className="dashboard-header">
              <h2 className="dashboard-title">Create / Edit Invoice</h2>
            </div>

            <div className="invoice-workspace">
              {/* Creator Form */}
              <div className="invoice-form-container">
                
                {/* Company Header (Fully Editable) */}
                <h4 className="form-section-title">Billing Entity Details (Seller)</h4>
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Company Address</label>
                  <textarea 
                    rows={2} 
                    className="form-input" 
                    value={formData.companyAddress}
                    onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                  />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">GSTIN / UIN</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.companyGst}
                      onChange={(e) => handleInputChange('companyGst', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State & Code</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.companyState}
                      onChange={(e) => handleInputChange('companyState', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Website</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.companyWebsite}
                      onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">E-Mail</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={formData.companyEmail}
                      onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                    />
                  </div>
                </div>

                {/* Consignee */}
                <h4 className="form-section-title">Consignee (Buyer / Bill To)</h4>
                <div className="form-group">
                  <label className="form-label">Consignee Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.consigneeName}
                    onChange={(e) => handleInputChange('consigneeName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Consignee Address</label>
                  <textarea 
                    rows={2} 
                    className="form-input" 
                    value={formData.consigneeAddress}
                    onChange={(e) => handleInputChange('consigneeAddress', e.target.value)}
                  />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">GSTIN / UIN</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.consigneeGst}
                      onChange={(e) => handleInputChange('consigneeGst', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State & Code</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.consigneeState}
                      onChange={(e) => handleInputChange('consigneeState', e.target.value)}
                    />
                  </div>
                </div>

                {/* Debit Note Details */}
                <h4 className="form-section-title">Invoice / Document Details</h4>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Debit Note No / Invoice No</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.debitNoteNo}
                      onChange={(e) => handleInputChange('debitNoteNo', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dated</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Original Invoice No</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.originalInvoiceNo}
                      onChange={(e) => handleInputChange('originalInvoiceNo', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Original Invoice Date</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.originalInvoiceDate}
                      onChange={(e) => handleInputChange('originalInvoiceDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Other References</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.otherRefs}
                    onChange={(e) => handleInputChange('otherRefs', e.target.value)}
                  />
                </div>

                {/* Tax Setup */}
                <h4 className="form-section-title">GST & Round Off settings</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">GST Tax Category</label>
                    <select 
                      className="form-input"
                      value={formData.gstCategory || 'exempted'}
                      onChange={(e) => handleInputChange('gstCategory', e.target.value)}
                    >
                      <option value="exempted">Exempted</option>
                      <option value="rcm">GST charge applicable for RCM (5% total - CGST 2.5% + SGST 2.5%)</option>
                      <option value="forward_5">Forward Charge 5% (CGST 2.5% + SGST 2.5%)</option>
                      <option value="forward_18">Forward Charge 18% (CGST 9% + SGST 9%)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Round Off (+/-)</label>
                    <input 
                      type="number"
                      step="any"
                      className="form-input" 
                      placeholder="e.g. -0.50"
                      value={formData.roundOff}
                      onChange={(e) => handleInputChange('roundOff', e.target.value)}
                    />
                  </div>
                </div>

                {/* Transport Cargo */}
                <h4 className="form-section-title">Transport & Shipment Details</h4>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Vessel / Flight No</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.vesselFlightNo}
                      onChange={(e) => handleInputChange('vesselFlightNo', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Place of Receipt by Shipper</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.placeOfReceipt}
                      onChange={(e) => handleInputChange('placeOfReceipt', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">City/Port of Loading</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.portOfLoading}
                      onChange={(e) => handleInputChange('portOfLoading', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City/Port of Discharge</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.portOfDischarge}
                      onChange={(e) => handleInputChange('portOfDischarge', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">No of CTNS</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.ctns}
                      onChange={(e) => handleInputChange('ctns', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CBM Volume</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.cbm}
                      onChange={(e) => handleInputChange('cbm', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                    />
                  </div>
                </div>

                {/* Dynamic Table Particulars */}
                <h4 className="form-section-title">Billing Items Table</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Provide Qty & Rate to multiply, or type a manual amount directly in the "Amount" field.
                </p>
                <table className="items-form-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40%' }}>Particulars</th>
                      <th style={{ width: '12%' }}>Qty</th>
                      <th style={{ width: '15%' }}>Rate</th>
                      <th style={{ width: '13%' }}>Per</th>
                      <th style={{ width: '15%' }}>Amount</th>
                      <th style={{ width: '5%' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ position: 'relative' }}>
                          <textarea 
                            rows={1}
                            className="form-input" 
                            style={{ width: '100%', resize: 'vertical' }}
                            value={item.particulars}
                            onChange={(e) => {
                              handleItemChange(idx, 'particulars', e.target.value);
                              setActiveRowIdx(idx);
                            }}
                            onFocus={() => setActiveRowIdx(idx)}
                            placeholder="Particulars"
                          />
                          {activeRowIdx === idx && (
                            <SuggestionsDropdown 
                              query={item.particulars} 
                              list={suggestions} 
                              onSelect={(val) => {
                                handleItemChange(idx, 'particulars', val);
                                setActiveRowIdx(null);
                              }}
                              onClose={() => setActiveRowIdx(null)}
                            />
                          )}
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="form-input" 
                            style={{ width: '100%' }}
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            placeholder="Qty"
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="form-input" 
                            style={{ width: '100%' }}
                            value={item.rate}
                            onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                            placeholder="Rate"
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="form-input" 
                            style={{ width: '100%' }}
                            value={item.per}
                            onChange={(e) => handleItemChange(idx, 'per', e.target.value)}
                            placeholder="per"
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="form-input" 
                            style={{ width: '100%' }}
                            value={item.amount}
                            onChange={(e) => handleItemChange(idx, 'amount', e.target.value)}
                            placeholder="Amount"
                          />
                        </td>
                        <td>
                          <button 
                            type="button" 
                            className="btn-icon-danger"
                            onClick={() => removeItemRow(idx)}
                            disabled={formData.items.length <= 1}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" className="btn-add-item" onClick={addItemRow}>
                  <Plus size={16} /> Add Charge Row
                </button>

                {/* Bank Details (Fully Editable) */}
                <h4 className="form-section-title">Bank Accounts Info</h4>
                <div className="form-group">
                  <label className="form-label">A/c Holder Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.bankHolderName}
                    onChange={(e) => handleInputChange('bankHolderName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Bank Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                  />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Account No</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.bankAccount}
                      onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Branch & IFSC</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.bankBranch}
                      onChange={(e) => handleInputChange('bankBranch', e.target.value)}
                    />
                  </div>
                </div>

                {/* Signatory (Fully Editable) */}
                <h4 className="form-section-title">Signatory Details</h4>
                <div className="form-group">
                  <label className="form-label">Authorised Signatory Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.signatoryName}
                    onChange={(e) => handleInputChange('signatoryName', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Amount Chargeable in Words (Override)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Leave empty to calculate automatically"
                    value={formData.wordsOverride}
                    onChange={(e) => handleInputChange('wordsOverride', e.target.value)}
                  />
                </div>

                {/* Bottom Actions Row inside Form */}
                <div className="form-actions-row">
                  <button className="btn-outline" style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: '#EF4444', borderColor: '#EF4444' }} onClick={handleClearForm}>
                    <Trash2 size={20} /> Clear Form
                  </button>
                  <button className="btn-outline" style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} onClick={handleSaveInvoice}>
                    <Save size={20} /> Save Invoice
                  </button>
                  <button className="btn-primary" style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} onClick={handleDownloadPDF}>
                    <Printer size={20} /> Download PDF
                  </button>
                </div>
              </div> {/* End of invoice-form-container */}

              {/* LIVE PREVIEW COLUMN (Visible on screen, responsive and scrolls on mobile) */}
              <div className="invoice-preview-container">
                <div className="preview-scroll-wrapper" style={{ overflowX: 'auto', width: '100%' }}>
                  {/* Printable Invoice Page (Restructured Grid matching the first image layout exactly) */}
                  <div className="invoice-preview-card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', color: '#000000', width: '794px', boxSizing: 'border-box' }}>
                    <div className="bill-header" style={{
                      border: '1.5px solid #000000',
                      borderBottom: 'none',
                      textAlign: 'center',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      fontSize: '1.1rem',
                      padding: '0.4rem'
                    }}>
                      {billTitle}
                    </div>

                    {/* Top Metadata Grid: divided into Left Half (Seller, Buyer) & Right Half (Note dates, cargo specs) */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1.1fr 1fr', 
                      border: '1.5px solid #000000', 
                      borderBottom: 'none'
                    }}>
                      {/* Left Column (Seller Info & Buyer Info) */}
                      <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1.5px solid #000000' }}>
                        {/* Seller block */}
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '110px 1fr', 
                          alignItems: 'center', 
                          padding: '8px', 
                          borderBottom: '1.5px solid #000000' 
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <SVATLogo />
                            <div style={{ fontSize: '0.52rem', fontWeight: '900', color: '#000000', marginTop: '4px', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1 }}>
                              Container Supplying Agency
                            </div>
                          </div>
                          <div style={{ paddingLeft: '10px', textAlign: 'left' }}>
                            <div style={{ fontSize: '1.18rem', fontWeight: '800', color: '#0F6236', lineHeight: 1.1 }}>
                              {formData.companyName}
                            </div>
                            <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#A82C2C', textTransform: 'uppercase', marginTop: '3px', letterSpacing: '0.5px' }}>Export cargo movers</div>
                            <div style={{ fontSize: '0.68rem', marginTop: '3px', color: '#000000', lineHeight: 1.3 }}>
                              {formData.companyAddress}<br />
                              <strong>GSTIN/UIN:</strong> {formData.companyGst} | <strong>State Name:</strong> {formData.companyState}<br />
                              <strong>Website:</strong> {formData.companyWebsite} | <strong>E-Mail:</strong> {formData.companyEmail}<br />
                              <strong style={{ display: 'block', marginTop: '2px', color: '#1E293B', fontSize: '0.62rem' }}>ISO 9001:2015 Certified transport company</strong>
                            </div>
                          </div>
                        </div>

                        {/* Buyer block */}
                        <div style={{ padding: '8px', textAlign: 'left', flexGrow: 1, fontSize: '0.7rem', lineHeight: 1.4 }}>
                          <div style={{ fontWeight: '700', textTransform: 'uppercase', textDecoration: 'underline', marginBottom: '2px' }}>Buyer (Bill to)</div>
                          {formData.consigneeName && <div style={{ fontWeight: '900', fontSize: '0.82rem', color: '#000000', marginBottom: '2px' }}>{formData.consigneeName}</div>}
                          {formData.consigneeAddress && <div>{formData.consigneeAddress}</div>}
                          {(formData.consigneeGst || formData.consigneeState) && (
                            <div style={{ marginTop: '2px' }}>
                              {formData.consigneeGst && <span><strong>GSTIN/UIN:</strong> {formData.consigneeGst}</span>}
                              {formData.consigneeGst && formData.consigneeState ? ' | ' : ''}
                              {formData.consigneeState && <span><strong>State Name:</strong> {formData.consigneeState}</span>}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Column (Document specifications) */}
                      <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.7rem', textAlign: 'left' }}>
                        {/* Row 1 */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', borderBottom: '1.5px solid #000000', minHeight: '38px' }}>
                          <div style={{ borderRight: '1.5px solid #000000', padding: '4px' }}>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#555' }}>Debit Note No.</span>
                            <strong style={{ fontSize: '0.75rem' }}>{formData.debitNoteNo}</strong>
                          </div>
                          <div style={{ padding: '4px' }}>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#555' }}>Dated</span>
                            <strong style={{ fontSize: '0.75rem' }}>{formData.date}</strong>
                          </div>
                        </div>
                        
                        {/* Row 2 */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', borderBottom: '1.5px solid #000000', minHeight: '38px' }}>
                          <div style={{ borderRight: '1.5px solid #000000', padding: '4px' }}>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#555' }}>Original Invoice No. & Date.</span>
                            <strong>{formData.originalInvoiceNo || ''} {formData.originalInvoiceDate ? `dt. ${formData.originalInvoiceDate}` : ''}</strong>
                          </div>
                          <div style={{ padding: '4px' }}>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#555' }}>Other References</span>
                            <strong>{formData.otherRefs || ''}</strong>
                          </div>
                        </div>

                        {/* Row 3 */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', borderBottom: '1.5px solid #000000', minHeight: '38px' }}>
                          <div style={{ borderRight: '1.5px solid #000000', padding: '4px' }}>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#555' }}>Vessel/Flight No.</span>
                            <strong style={{ fontSize: '0.75rem' }}>{formData.vesselFlightNo}</strong>
                          </div>
                          <div style={{ padding: '4px' }}>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#555' }}>Place of receipt by shipper:</span>
                            <strong>{formData.placeOfReceipt}</strong>
                          </div>
                        </div>

                        {/* Row 4 */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', borderBottom: '1.5px solid #000000', minHeight: '38px' }}>
                          <div style={{ borderRight: '1.5px solid #000000', padding: '4px' }}>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#555' }}>City/Port of Loading</span>
                            <strong>{formData.portOfLoading}</strong>
                          </div>
                          <div style={{ padding: '4px' }}>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#555' }}>City/Port of Discharge</span>
                            <strong>{formData.portOfDischarge}</strong>
                          </div>
                        </div>

                        {/* Row 5 (Cargo dimensions) */}
                        <div style={{ padding: '8px', lineHeight: 1.4, flexGrow: 1 }}>
                          {formData.ctns && <span><strong>NO OF CTNS – </strong> {formData.ctns}<br /></span>}
                          {formData.cbm && <span><strong>CBM – </strong> {formData.cbm}<br /></span>}
                          {formData.weight && <span><strong>WEIGHT – </strong> {formData.weight}<br /></span>}
                        </div>
                      </div>
                    </div>

                    {/* Main Grid Table */}
                    <div className="bill-table-container" style={{ border: '1.5px solid #000000' }}>
                      <table className="bill-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
                        <thead>
                          <tr>
                            <th style={{ width: '8%', textAlign: 'center', borderRight: '1.5px solid #000000', borderBottom: '1.5px solid #000000', padding: '4px' }}>Sl No.</th>
                            <th style={{ width: '45%', textAlign: 'center', borderRight: '1.5px solid #000000', borderBottom: '1.5px solid #000000', padding: '4px' }}>Particulars</th>
                            <th style={{ width: '12%', textAlign: 'center', borderRight: '1.5px solid #000000', borderBottom: '1.5px solid #000000', padding: '4px' }}>Quantity</th>
                            <th style={{ width: '15%', textAlign: 'center', borderRight: '1.5px solid #000000', borderBottom: '1.5px solid #000000', padding: '4px' }}>Rate</th>
                            <th style={{ width: '10%', textAlign: 'center', borderRight: '1.5px solid #000000', borderBottom: '1.5px solid #000000', padding: '4px' }}>per</th>
                            <th style={{ width: '10%', textAlign: 'center', borderBottom: '1.5px solid #000000', padding: '4px' }}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.items.map((item, idx) => {
                            const cleanAmtStr = (item.amount || '').toString().replace(/[^0-9.]/g, '');
                            const cleanQtyStr = (item.quantity || '').toString().replace(/[^0-9.]/g, '');
                            const cleanRateStr = (item.rate || '').toString().replace(/[^0-9.]/g, '');
                            
                            const hasAmt = cleanAmtStr !== '' || (cleanQtyStr !== '' && cleanRateStr !== '');
                            const amt = hasAmt
                              ? (cleanAmtStr !== '' 
                                  ? (parseFloat(cleanAmtStr) || 0) 
                                  : (parseFloat(cleanQtyStr) || 0) * (parseFloat(cleanRateStr) || 0))
                              : null;
                              
                            const qtyVal = cleanQtyStr !== '' ? parseFloat(cleanQtyStr) : null;
                            const rateVal = cleanRateStr !== '' ? parseFloat(cleanRateStr) : null;
                            const amtStr = amt !== null ? amt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';

                            return (
                              <tr key={idx} className="bill-table-row">
                                <td style={{ textAlign: 'center', borderRight: '1.5px solid #000000', padding: '6px' }}>{idx + 1}</td>
                                <td style={{ whiteSpace: 'pre-line', borderRight: '1.5px solid #000000', padding: '6px', textAlign: 'left' }}>
                                  <strong style={{ display: 'block', fontSize: '0.75rem' }}>{item.particulars}</strong>
                                </td>
                                <td style={{ textAlign: 'right', borderRight: '1.5px solid #000000', padding: '6px' }}>{qtyVal !== null ? qtyVal : ''}</td>
                                <td style={{ textAlign: 'right', borderRight: '1.5px solid #000000', padding: '6px' }}>{rateVal !== null ? rateVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}</td>
                                <td style={{ borderRight: '1.5px solid #000000', padding: '6px', textAlign: 'center' }}>{item.per || ''}</td>
                                <td style={{ textAlign: 'right', fontWeight: 800, padding: '6px' }}>{amtStr}</td>
                              </tr>
                            );
                          })}

                        {/* Extra padding rows to keep height scaled like standard A4 template */}
                        {Array.from({ length: Math.max(0, 6 - formData.items.length) }).map((_, idx) => (
                          <tr key={`empty-${idx}`} className="bill-table-row" style={{ height: '32px' }}>
                            <td style={{ borderRight: '1.5px solid #000000' }}></td>
                            <td style={{ borderRight: '1.5px solid #000000' }}></td>
                            <td style={{ borderRight: '1.5px solid #000000' }}></td>
                            <td style={{ borderRight: '1.5px solid #000000' }}></td>
                            <td style={{ borderRight: '1.5px solid #000000' }}></td>
                            <td></td>
                          </tr>
                        ))}

                        {/* Sub Total row (Always shown) */}
                        <tr style={{ borderTop: '1.5px solid #000000', fontWeight: 'bold' }}>
                          <td style={{ borderRight: '1.5px solid #000000', padding: '4px' }}></td>
                          <td colSpan={4} style={{ borderRight: '1.5px solid #000000', textAlign: 'right', padding: '4px' }}>Sub Total</td>
                          <td style={{ textAlign: 'right', padding: '4px' }}>{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>

                        {/* CGST row */}
                        <tr style={{ fontWeight: 'bold' }}>
                          <td style={{ borderRight: '1.5px solid #000000', padding: '4px' }}></td>
                          <td colSpan={4} style={{ borderRight: '1.5px solid #000000', textAlign: 'right', padding: '4px' }}>
                            CGST ( {displayCgstRate ? `${displayCgstRate} %` : '        %'} )
                          </td>
                          <td style={{ textAlign: 'right', padding: '4px' }}>{cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>

                        {/* SGST row */}
                        <tr style={{ fontWeight: 'bold' }}>
                          <td style={{ borderRight: '1.5px solid #000000', padding: '4px' }}></td>
                          <td colSpan={4} style={{ borderRight: '1.5px solid #000000', textAlign: 'right', padding: '4px' }}>
                            SGST ( {displaySgstRate ? `${displaySgstRate} %` : '        %'} )
                          </td>
                          <td style={{ textAlign: 'right', padding: '4px' }}>{sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>

                        {/* IGST row */}
                        <tr style={{ fontWeight: 'bold' }}>
                          <td style={{ borderRight: '1.5px solid #000000', padding: '4px' }}></td>
                          <td colSpan={4} style={{ borderRight: '1.5px solid #000000', textAlign: 'right', padding: '4px' }}>
                            IGST ( 0 % )
                          </td>
                          <td style={{ textAlign: 'right', padding: '4px' }}>{igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>

                        {/* Round Off row */}
                        <tr style={{ fontWeight: 'bold' }}>
                          <td style={{ borderRight: '1.5px solid #000000', padding: '4px' }}></td>
                          <td colSpan={4} style={{ borderRight: '1.5px solid #000000', textAlign: 'right', padding: '4px' }}>
                            Round Off (+/-)
                          </td>
                          <td style={{ textAlign: 'right', padding: '4px' }}>{(parseFloat(formData.roundOff) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        
                        {/* Grand Total Row */}
                        <tr style={{ borderTop: '1.5px solid #000000', fontWeight: '800', backgroundColor: '#E2E8F0' }}>
                          <td style={{ borderRight: '1.5px solid #000000', padding: '5px' }}></td>
                          <td colSpan={4} style={{ borderRight: '1.5px solid #000000', textAlign: 'right', padding: '5px', fontWeight: '800' }}>
                            Grand Total
                          </td>
                          <td style={{ textAlign: 'right', padding: '5px', fontWeight: '800' }}>
                            ₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* GST RCM Status Bar */}
                  <div style={{ 
                    border: '1.5px solid #000000', 
                    borderTop: 'none',
                    padding: '5px 8px',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    textAlign: 'left',
                    backgroundColor: '#FFFFFF',
                    lineHeight: 1.3
                  }}>
                    <span>Whether GST is payable on Reverse Charge basis (RCM): <strong>{
                      formData.gstCategory === 'rcm' 
                        ? 'GST charge applicable for RCM' 
                        : (formData.gstCategory === 'exempted' ? 'Exempted' : 'No')
                    }</strong></span>
                  </div>

                  {/* Bottom Section: Words block on left, Bank + Signatory on right */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '53% 47%', 
                    border: '1.5px solid #000000', 
                    borderTop: 'none',
                    fontSize: '0.7rem',
                    textAlign: 'left'
                  }}>
                    {/* Left Column: Amount in Words */}
                    <div style={{ 
                      padding: '8px', 
                      borderRight: '1.5px solid #000000', 
                      display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      minHeight: '170px'
                    }}>
                      <div style={{ marginBottom: '4px' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.72rem' }}>Amount Chargeable (in words):</span>
                        <span style={{ float: 'right', fontStyle: 'italic', fontWeight: 'bold', fontSize: '0.62rem' }}>E. & O.E</span>
                      </div>
                      <strong style={{ fontSize: '0.78rem', textTransform: 'uppercase', lineHeight: '1.3' }}>
                        {amountInWords}
                      </strong>
                    </div>

                    {/* Right Column: Bank details (top) & Signatory (bottom) */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {/* Bank Details */}
                      <div style={{ padding: '8px', flexGrow: 1, lineHeight: '1.4' }}>
                        <div style={{ fontWeight: '700', textDecoration: 'underline', marginBottom: '4px' }}>Company's Bank Details:</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr' }}>
                          <span>A/c Holder's Name</span>
                          <strong>: {formData.bankHolderName}</strong>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr' }}>
                          <span>Bank Name</span>
                          <strong>: {formData.bankName}</strong>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr' }}>
                          <span>A/c No.</span>
                          <strong>: {formData.bankAccount}</strong>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr' }}>
                          <span>Branch & IFS Code</span>
                          <strong>: {formData.bankBranch}</strong>
                        </div>
                      </div>

                      {/* Signatory Block */}
                      <div style={{ 
                        borderTop: '1.5px solid #000000', 
                        padding: '8px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'space-between',
                        minHeight: '90px'
                      }}>
                        <div style={{ fontWeight: '700', textAlign: 'center', textTransform: 'uppercase' }}>
                          for {formData.companyName}
                        </div>
                        <div style={{ textAlign: 'right', marginTop: 'auto' }}>
                          <strong style={{ display: 'block', fontSize: '0.72rem', textAlign: 'right' }}>({formData.signatoryName})</strong>
                          <span style={{ fontSize: '0.62rem', fontWeight: 'bold', display: 'block', color: '#444', textAlign: 'right', marginTop: '2px' }}>Authorised Signatory</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bill-disclaimer" style={{ textAlign: 'center', fontSize: '0.62rem', marginTop: '4px', fontStyle: 'italic' }}>
                    This is a Computer Generated Document
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoice History Tab */}
        {activeTab === 'history' && (
          <div>
            <div className="dashboard-header">
              <h2 className="dashboard-title">Invoice History Registry</h2>
            </div>

            <div className="history-list">
              {invoices.map((inv) => (
                <div key={inv.id} className="history-item">
                  <div className="history-left">
                    <p className="history-code">{inv.id}</p>
                    <p className="history-name">{inv.consignee}</p>
                    <p className="history-date">Generated: {inv.date}</p>
                  </div>
                  <div className="history-right">
                    <span className={`badge-status ${inv.status}`}>{inv.status}</span>
                    <span className="history-amount">₹{inv.amount.toLocaleString()}</span>
                    <button className="btn-outline" onClick={() => handleLoadInvoice(inv)}>
                      View & Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav">
        <button 
          className={`mobile-nav-link ${activeTab === 'overview' ? 'active' : ''}`} 
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard className="mobile-nav-icon" />
          <span>Overview</span>
        </button>
        <button 
          className={`mobile-nav-link ${activeTab === 'creator' ? 'active' : ''}`} 
          onClick={() => setActiveTab('creator')}
        >
          <Plus className="mobile-nav-icon" />
          <span>Create</span>
        </button>
        <button 
          className={`mobile-nav-link ${activeTab === 'history' ? 'active' : ''}`} 
          onClick={() => setActiveTab('history')}
        >
          <History className="mobile-nav-icon" />
          <span>History</span>
        </button>
        <button className="mobile-nav-link logout" onClick={onLogout}>
          <LogOut className="mobile-nav-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
