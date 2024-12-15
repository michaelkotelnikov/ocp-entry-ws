import React from "react";
import { Container, Typography } from "@mui/material";
import DataDisplay from "./components/DataDisplay";

function App() {
  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h3" gutterBottom>
        React Frontend
      </Typography>
      <DataDisplay />
    </Container>
  );
}

export default App;

