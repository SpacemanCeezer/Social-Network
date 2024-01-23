module.exports = date => {
  // Define date formatting options
  const options = { 
    month: 'long', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true 
  };
  
  // Convert the date to a formatted string
  return new Date(date).toLocaleDateString(undefined, options);
};
