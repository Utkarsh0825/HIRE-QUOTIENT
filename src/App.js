import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  Collapse,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const HoldingsTable = () => {
  const [holdings, setHoldings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://canopy-frontend-task.now.sh/api/holdings');
        const groupedHoldings = groupByAssetClass(response.data.payload);
        setHoldings(groupedHoldings);
      } catch (error) {
        setError('Error fetching holdings data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupByAssetClass = (data) => {
    return data.reduce((acc, holding) => {
      const assetClass = holding.asset_class;
      acc[assetClass] = acc[assetClass] || [];
      acc[assetClass].push(holding);
      return acc;
    }, {});
  };

  const toggleExpand = (assetClass) => {
    setExpandedGroups({
      ...expandedGroups,
      [assetClass]: !expandedGroups[assetClass]
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: '100%' }}>
        <TableHead sx={{ width: '100%' }}>
          <TableRow>
            <TableCell sx={{ width: '20%' }}>Name</TableCell>
            <TableCell sx={{ width: '10%' }}>Ticker</TableCell>
            <TableCell sx={{ width: '15%' }}>Asset Class</TableCell>
            <TableCell sx={{ width: '10%' }}>Average Price</TableCell>
            <TableCell sx={{ width: '10%' }}>Market Price</TableCell>
            <TableCell sx={{ width: '10%' }}>Latest Change %</TableCell>
            <TableCell sx={{ width: '25%' }}>Market Value (Base CCY)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ width: '100%' }}>
          {Object.entries(holdings).map(([assetClass, groupHoldings]) => (
            <> {/* Wrap group in React.Fragment */}
              <TableRow key={assetClass}> 
                <TableCell colSpan={7} sx={{ p: 3 }}> 
                  <IconButton onClick={() => toggleExpand(assetClass)}>
                    {expandedGroups[assetClass] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                  <b>{assetClass}</b>
                </TableCell>
              </TableRow>
              <Collapse in={expandedGroups[assetClass]} timeout="auto" unmountOnExit>
                {/* Render the holding rows within this collapse */}
                {groupHoldings.map((holding) => (
                  <TableRow key={holding.name}>
                    <TableCell>{holding.name}</TableCell>
                    <TableCell>{holding.ticker}</TableCell>
                    <TableCell>{holding.asset_class}</TableCell>
                    <TableCell>{holding.avg_price}</TableCell>
                    <TableCell>{holding.market_price}</TableCell>
                    <TableCell>{holding.latest_chg_pct}</TableCell>
                    <TableCell>{holding.market_value_ccy}</TableCell>
                  </TableRow>
                ))}
              </Collapse>
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};


const App = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h2" gutterBottom align="center">
        Holdings Table
      </Typography>
      <Box sx={{ width: '100%' }}>
        <HoldingsTable />
      </Box>
    </Container>
  );
};

export default App;
