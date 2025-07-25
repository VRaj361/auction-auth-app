import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BounceLoader } from 'react-spinners';
import '../App.css';

function CompanyDetails({ user: userProp }) {
  const user = userProp || JSON.parse(localStorage.getItem('user'));
  const baseUrl = process.env.REACT_APP_SERVER_URL; // e.g. http://localhost:8000/

  // canonical company data fetched from server (approved data)
  const [company, setCompany] = useState(null); // null => no data yet
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); // true => form enabled
  const [isRequest, setIsRequest] = useState(false); // editing existing => change request
  const [submitting, setSubmitting] = useState(false);

  // form state
  const [form, setForm] = useState({
    companyName: '',
    address: '',
    phone: '',
    // email: '',
    gstNumber: '',
    panNumber: '',
    banker: '',
    accountNo: '',
  });
  const [turnoverFile, setTurnoverFile] = useState(null); // File obj

  // load approved company data (if any)
  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    fetch(`${baseUrl}api/company-details/${user._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Object.keys(data.company)?.length) {
          setCompany(data.company);
          // populate form with existing data
          setForm({
            companyName: data.company.companyName || '',
            address: data.company.companyAddress || '',
            phone: data.company.companyPhone || '',
            // email: data.company.email || '',
            gstNumber: data.company.companyGst || '',
            panNumber: data.company.companyPan || '',
            banker: data.company.companyBanker || '',
            accountNo: data.company.companyAccountNo || '',
          });

          setEditMode(false); // view-only when data exists
        } else {
          // no data => allow create
          setCompany(null);
          setEditMode(true);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load Vendor profile');
        setEditMode(true); // fallback allow create
      })
      .finally(() => setLoading(false));
  }, [user?._id, baseUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file.');
      return;
    }
    setTurnoverFile(file || null);
  };

  const handleRequestChange = () => {
    setEditMode(true);
    setIsRequest(true); // indicates we will create a change-request doc
  };

  const resetEdit = () => {
    // revert changes
    if (company) {
      setForm({
        companyName: company.companyName || '',
        address: company.companyAddress || '',
        phone: company.companyPhone || '',
        // email: company.email || '',
        gstNumber: company.companyGst || '',
        panNumber: company.companyPan || '',
        banker: company.companyBanker || '',
        accountNo: company.companyAccountNo || '',
      });
    }
    setTurnoverFile(null);
    setEditMode(false);
    setIsRequest(false);
  };

  const validateForm = () => {
    if (!form.companyName.trim()) return "Company Name is required";
    if (!form.address.trim()) return "Address is required";
    if (!form.phone.trim()) return "Phone Number is required";
    if (!/^[0-9]{6,15}$/.test(form.phone)) return "Phone number must be digits (6-15)";
    if (!form.gstNumber) return "GST number is required";
    if (form.gstNumber && form.gstNumber.length < 5) return "GST Number seems invalid";
    if (!form.panNumber) return "PAN number is required";
    if (form.panNumber && form.panNumber.length < 5) return "PAN Number seems invalid";
    if (!form.banker) return "Bank name is required";
    if (!form.accountNo) return "Account Number is required";
    if (!turnoverFile) return "Turnover Attachment is required";
    if (turnoverFile && turnoverFile.type !== "application/pdf")
      return "Please upload a valid PDF file";
    return null; // valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error('User not found.');
      return;
    }

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    const fd = new FormData();
    fd.append('userId', user._id);
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (turnoverFile) fd.append('turnoverPdf', turnoverFile);

    setSubmitting(true);
    try {
      const endpoint = company && !isRequest
        ? `${baseUrl}api/company-details/${user._id}` // update directly (should rarely happen; admin)
        : company && isRequest
          ? `${baseUrl}api/company-details/request/${user._id}` // user editing existing => change request
          : `${baseUrl}api/company-details/${user._id}`; // creating first record

      const method = company && !isRequest ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        body: fd,
      });
      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || 'Save failed');
      } else {
        if (!company) {
          // created initial company record -> show saved and lock
          toast.success('Vendor profile saved.');
          setCompany(data.company);
          setEditMode(false);
        } else if (isRequest) {
          toast.success('Change request submitted. Awaiting approval.');
          setEditMode(false);
          setIsRequest(false);
        } else {
          toast.success('Vendor profile updated.');
          setCompany(data.company);
          setEditMode(false);
        }
        setTurnoverFile(null);
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error.');
    } finally {
      setSubmitting(false);
    }
  };

  // if (loading) return <p style={{color:'#004d40'}}>Loading Vendor profile...</p>;

  if(loading) 
    return (
      <BounceLoader
        color={"#00695c"}
        loading={loading}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );

  return (
    <div className="company-details-container">
      <form className="company-details-form" onSubmit={handleSubmit}>
        <h2>Vendor Profile</h2>
        <label htmlFor="companyName">Company Name</label>
        <input
          id="companyName"
          name="companyName"
          type="text"
          value={form.companyName}
          onChange={handleChange}
          placeholder="Company Name"
          disabled={!editMode}
          required
        />

        <label htmlFor="address">Address</label>
        <textarea
          id="address"
          name="address"
          rows={2}
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          disabled={!editMode}
          required
        />

        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          disabled={!editMode}
          required
        />

        {/* <label htmlFor="cEmail">Email</label> */}
        {/* <input
          id="cEmail"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Company Email"
          disabled={!editMode}
          required
        /> */}

        <label htmlFor="gstNumber">GST Number</label>
        <input
          id="gstNumber"
          name="gstNumber"
          type="text"
          value={form.gstNumber}
          onChange={handleChange}
          placeholder="GST Number"
          disabled={!editMode}
        />

        <label htmlFor="panNumber">PAN Number</label>
        <input
          id="panNumber"
          name="panNumber"
          type="text"
          value={form.panNumber}
          onChange={handleChange}
          placeholder="PAN Number"
          disabled={!editMode}
        />

        <label htmlFor="banker">Bank Name</label>
        <input
          id="banker"
          name="banker"
          type="text"
          value={form.banker}
          onChange={handleChange}
          placeholder="Bank / Branch"
          disabled={!editMode}
        />

        <label htmlFor="accountNo">Account No</label>
        <input
          id="accountNo"
          name="accountNo"
          type="text"
          value={form.accountNo}
          onChange={handleChange}
          placeholder="Account Number"
          disabled={!editMode}
        />

        <label htmlFor="turnoverPdf">Turnover (PDF)</label>
        <input
          id="turnoverPdf"
          name="turnoverPdf"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={!editMode}
        />
        {company?.turnoverPdfUrl && !editMode && (
          <a
            className="company-pdf-link"
            href={company.turnoverPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View current PDF
          </a>
        )}

        {/* Action Row */}
        <div className="company-details-actions">
          {editMode ? (
            <>
              <button
                type="button"
                className="company-cancel-btn"
                onClick={resetEdit}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="company-save-btn"
                disabled={submitting}
              >
                {submitting ? 'Saving…' : isRequest ? 'Submit Change Request' : 'Save'}
              </button>
            </>
          ) : (
            company ? (
              <button
                type="button"
                className="company-request-btn"
                onClick={handleRequestChange}
              >
                Request to change any detail
              </button>
            ) : null
          )}
        </div>
      </form>
    </div>
  );
}

export default CompanyDetails;