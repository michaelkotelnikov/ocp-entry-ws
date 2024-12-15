import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Use relative URL to rely on the proxy for backend communication
const BACKEND_URL = "/api";

function DataDisplay() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);

    fetch(`${BACKEND_URL}/data`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Backend Data Visualization
      </Typography>

      {loading && <CircularProgress />}

      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}

      {data && !loading && !error && (
        <>
          <Typography variant="h6" gutterBottom>
            {data.message}
          </Typography>
          <BarChart
            width={500}
            height={300}
            data={data.data.map((value, index) => ({ name: `Item ${index + 1}`, value }))}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchData}
            style={{ marginTop: "20px" }}
          >
            Refresh Data
          </Button>
        </>
      )}
    </div>
  );
}

export default DataDisplay;

