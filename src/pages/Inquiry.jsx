import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import '../App.css'


function Inquiry() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}api/inquiries`)
      .then((res) => res.json())
      .then((data) => {setInquiries(data); setLoading(false);})
      .catch((err) => { console.error(err); setLoading(false);});
  }, []);

  return (
    <div className="inquiry-list-container">
      <h2>Request For Quotation</h2>
      <BounceLoader
        color={"#00695c"}
        loading={loading}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <div className="inquiry-list">
        {inquiries.map((inq) => (
          <Link
            key={inq._id}
            to={`/dashboard/inquiry/${inq._id}`}
            className="inquiry-card-link"
          >
            <div className="inquiry-card">
              <h3>{inq.title}</h3>
              <p>{inq.shortDescription}</p>
              <small>ID: {inq.inquiryNumber}</small>
              <p>{inq.lastSubmissionDate ? `Last Submission Date: ` + inq.lastSubmissionDate : ""}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Inquiry;
