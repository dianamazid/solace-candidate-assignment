"use client";

import { useEffect, useState } from "react";

// Create interface to define types
interface Advocate {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number | string;
  phoneNumber: string;
}

export default function Home() {
  // update state definitions to use interface
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  // Use state variable for searchTerm
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
      setSearchTerm(term);

    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        // Default to null if field is empty
        // Search happens regardless of case sensitivity 
        (advocate.firstName || "").toLowerCase().includes(term.toLowerCase()) ||
        (advocate.lastName || "").toLowerCase().includes(term.toLowerCase()) ||
        (advocate.city || "").toLowerCase().includes(term.toLowerCase()) ||
        (advocate.degree || "").toLowerCase().includes(term.toLowerCase()) ||
        (advocate.specialties || []).join(",").toLowerCase().includes(term.toLowerCase()) ||
        (advocate.yearsOfExperience || "").toString().includes(term)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    // Reset search to empty string
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "16px"}}>Solace Advocates</h1>
      <div style={{ marginBottom: "24px" }}>
        <label htmlFor="search-input" style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>
          Search
        </label>
        <input
          id="search-input"
          type="text"
          value={searchTerm}
          onChange={onChange}
          placeholder="Search by name, city, degree, etc."
          style={{
            padding: "8px",
            width: "300px",
            marginRight: "12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          type="button"
          onClick={onClick}
          style={{
            padding: "8px 16px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset Search
        </button>
        {searchTerm && (
          <p style={{ marginTop: "12px", color: "#666" }}>
            Searching for: <strong>{searchTerm}</strong>
          </p>
        )}
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <thead>
          <tr  style={{ backgroundColor: "#f4f4f4" }}>
            <th style={thStyle}>First Name</th>
            <th style={thStyle}>Last Name</th>
            <th style={thStyle}>City</th>
            <th style={thStyle}>Degree</th>
            <th style={thStyle}>Specialties</th>
            <th style={thStyle}>Years of Experience</th>
            <th style={thStyle}>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate, index) => {
            return (
              <tr key={index} style={{ borderBottom: "1px solid #ddd", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9f9f9"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}>
                <td style={tdStyle}>{advocate.firstName}</td>
                <td style={tdStyle}>{advocate.lastName}</td>
                <td style={tdStyle}>{advocate.city}</td>
                <td style={tdStyle}>{advocate.degree}</td>
                <td style={tdStyle}>
                  {advocate.specialties.map((s, sIndex) => (
                    <div key={sIndex}>{s}</div>
                  ))}
                </td>
                <td style={tdStyle}>{advocate.yearsOfExperience}</td>
                <td style={tdStyle}>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #ccc",
};

const tdStyle: React.CSSProperties = {
  padding: "12px",
  verticalAlign: "top",
};