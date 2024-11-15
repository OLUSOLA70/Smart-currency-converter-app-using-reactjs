import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { HiSwitchHorizontal } from 'react-icons/hi';

const customStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '50px',
    height: '30px',
    width: '160px', 
    backgroundColor: 'white',
    borderColor: state.isFocused ? '#2684FF' : '#cccccc',
    boxShadow: state.isFocused ? '0 0 0 1px #2684FF' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#2684FF' : '#999999'
    }
  }),
  valueContainer: (base) => ({
    ...base,
    height: '30px',
    padding: '0 8px',
    fontSize: '14px'
  }),
  input: (base) => ({
    ...base,
    margin: '0px',
    color: '#333333'
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: '30px'
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected 
      ? '#2684FF' 
      : state.isFocused 
        ? '#f0f0f0' 
        : 'white',
    color: state.isSelected ? 'white' : '#333333',
    padding: '8px 12px',
    '&:hover': {
      backgroundColor: state.isSelected ? '#2684FF' : '#f0f0f0'
    }
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 9999
  }),
  singleValue: (base) => ({
    ...base,
    color: '#333333',
    fontSize: '14px'
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: '4px'
  }),
};

function App() {
    const [info, setInfo] = useState({});
    const [input, setInput] = useState('');
    const [from, setFrom] = useState("USD");
    const [to, setTo] = useState("EUR");
    const [options, setOptions] = useState([]);
    const [output, setOutput] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_KEY = "77512f3a07d6d9885a7700d7";

    useEffect(() => {
        setOutput(0);
        setError(null);
    }, [input, from, to]);

    useEffect(() => {
        setIsLoading(true);
        fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`)
            .then(res => res.json())
            .then((data) => {
                if (data && data.conversion_rates) {
                    const currencyOptions = Object.keys(data.conversion_rates).map((currency) => ({
                        value: currency,
                        label: currency,
                    }));
                    setOptions(currencyOptions);
                    setInfo(data.conversion_rates);
                } else {
                    throw new Error('Invalid response format');
                }
            })
            .catch((error) => {
                console.error("Error fetching available currencies:", error);
                setError("Failed to fetch available currencies");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const convert = () => {
        if (!input || isNaN(input)) {
            setError("Please enter a valid number");
            return;
        }
        const rate = info[to] / info[from];
        if (rate) {
            const result = parseFloat(input) * rate;
            setOutput(result);
            setError(null);
        } else {
            setError("Unable to get exchange rate");
        }
    };

    const flip = () => {
        const temp = from;
        setFrom(to);
        setTo(temp);
        setOutput(0);
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black'
        }}>
            <div style={{
                width: '480px', // Increased width for more spacious layout
                padding: '20px',
                backgroundColor: 'grey',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                color: 'yellow'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    fontSize: '25px', // Increased font size
                    marginBottom: '15px',
                    color: '#F5F5DC',
                    fontFamily: 'Pacifico, cursive'
                }}>SMART CURRENCY CONVERTER</h1>
                
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '5px',
                        color: '#F5F5DC',
                        fontStyle: ''
                    }}>Amount</label>
                    <input
                        type="number"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        style={{
                            width: '100%',
                            height: '35px', // Increased height for larger input
                            marginBottom: '10px',
                            padding: '5px 8px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            fontSize: '16px' // 
                        }}
                    />
                </div>

                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '10px'
                }}>
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '5px',
                            color: '#F5F5DC',
                            fontStyle: 'italic'
                        }}>From</label>
                        <Select
                            options={options}
                            value={options.find(opt => opt.value === from)}
                            onChange={(opt) => setFrom(opt.value)}
                            styles={customStyles}
                            isDisabled={isLoading}
                        />
                    </div>

                    <div style={{ padding: '0 10px' }}>
                        <HiSwitchHorizontal
                            size="40px"
                            onClick={flip}
                            style={{ cursor: 'pointer', color: 'green', marginTop: '30px'}}
                        />
                    </div>

                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '5px',
                            color: '#F5F5DC',
                            fontStyle: 'italic'
                        }}>To</label>
                        <Select
                            options={options}
                            value={options.find(opt => opt.value === to)}
                            onChange={(opt) => setTo(opt.value)}
                            styles={customStyles}
                            isDisabled={isLoading}
                        />
                    </div>
                </div>

                <button
                    onClick={convert}
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        height: '40px', // Increased button height for better fit
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginTop: '10px',
                        fontSize: '16px', // Increased font size for visibility
                        fontWeight: 'bold'
                    }}
                >
                    {isLoading ? 'Loading...' : 'Convert'}
                </button>

                {error && (
                    <div style={{ 
                        color: '#ff6b6b', 
                        marginTop: '10px', 
                        fontSize: '14px', 
                        textAlign: 'center' 
                    }}>
                        {error}
                    </div>
                )}

                {!error && output !== 0 && (
                    <div style={{ 
                        marginTop: '15px', 
                        textAlign: 'center',
                        padding: '10px',
                        backgroundColor: '#444',
                        borderRadius: '4px'
                    }}>
                        <div style={{ 
                            fontSize: '14px', 
                            marginBottom: '5px',
                            color: '#F5F5DC',
                            fontStyle: 'italic'
                        }}>Converted Amount:</div>
                        <div style={{ 
                            fontSize: '18px',
                            color: '#F5F5DC'
                        }}>
                            {input} {from} = {output.toFixed(2)} {to}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
