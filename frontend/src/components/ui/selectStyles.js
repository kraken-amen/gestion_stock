const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(4px)",
    borderColor: state.isFocused ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.2)",
    borderWidth: "2px",
    borderRadius: "0.75rem",
    minHeight: "48px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "rgba(255, 255, 255, 0.3)"
    }
  }),
  input: (base) => ({
    ...base,
    color: "white",
  }),
  singleValue: (base) => ({
    ...base,
    color: "white",
  }),
  placeholder: (base) => ({
    ...base,
    color: "rgba(255, 255, 255, 0.4)",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1e1b4b",
    borderRadius: "0.75rem",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "rgba(255, 255, 255, 0.1)" : "transparent",
    color: "white",
    "&:active": {
      backgroundColor: "rgba(255, 255, 255, 0.2)"
    }
  })
};

export default customSelectStyles;