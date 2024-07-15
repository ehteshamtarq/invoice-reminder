import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "./Table.css";
import { useNavigate } from "react-router-dom";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 20,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));



export default function SimpleTable({ invoices }) {

    const navigate = useNavigate();

    const goToDetails = (invoiceId)=>{
      const add = `/invoice/${invoiceId}`
      navigate(add)

    }


    const getStatusColor = (status) => {
  switch (status) {
    case 'paid':
      return 'green';
    case 'pending':
      return 'yellow';
    case 'due':
      return 'red';
    default:
      return 'black';
  }};

  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Invoice Number</StyledTableCell>
            <StyledTableCell >Name</StyledTableCell>
            <StyledTableCell >Amount</StyledTableCell>
            <StyledTableCell >Due Date</StyledTableCell>
            <StyledTableCell >Status</StyledTableCell>
            <StyledTableCell >Details</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((row) => (
            <StyledTableRow key={row.invoiceNumber}>
              <StyledTableCell>
                {row.invoiceNumber}
              </StyledTableCell>
              <StyledTableCell >{row.name}</StyledTableCell>
              <StyledTableCell >{row.amount}</StyledTableCell>
              <StyledTableCell >{new Date(row.dueDate).toLocaleDateString()}</StyledTableCell>
              <StyledTableCell > <div
                  className="status"
                  style={{ backgroundColor: getStatusColor(row.status) }}
                >
                  {row.status}
                </div></StyledTableCell>
                <StyledTableCell align="right"><button className="detail"  onClick={() => goToDetails(row.invoiceNumber)}>View</button></StyledTableCell>

            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
