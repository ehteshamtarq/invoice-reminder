import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import "./Loading.css";

export default function CircularIndeterminate() {
  return (
    <div className="loading" >
      <CircularProgress />
    </div>
  );
}
