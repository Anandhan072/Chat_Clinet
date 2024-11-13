import { useState, useEffect } from "react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();
const currentDay = currentDate.getDate(); // Fixed typo

const AccountForm = function ({ setSignupConsole }) {
  const colorGreen = {
    fontWeight: "300",
    fontSize: "1.3rem",
    color: "#55be55",
  };
  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    DOB: { day: currentDay, month: months[currentMonth], year: currentYear },
    gender: "Male",
    password: "",
    confirmpassword: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [createdAccount, setCreatedAccountn] = useState(false);
  const [accountMessage, setAccountMessage] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDOBChange = (e, field) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      DOB: {
        ...formData.DOB,
        [field]: value, // Dynamically update day, month, or year
      },
    });
  };
  const newErrors = {};
  const validate = () => {
    const dateCheck = new Date(
      formData.DOB.year,
      months.indexOf(formData.DOB.month),
      formData.DOB.day
    );

    if (!formData.firstName) {
      newErrors.firstName = "First name is required.";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required.";
    }
    if (dateCheck.getTime() >= Date.now()) {
      newErrors.DOB = "Invalid DOB. Please check your date. It must be today or earlier than today";
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required.";
    }
    if (!formData.password || formData.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters.";
    }
    if (formData.password !== formData.confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validate();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors); // Set errors to state
    } else {
      setErrors({}); // Clear errors if no issues

      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // Serialize formData to JSON
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error); // Extract error from response if any
        }
        const data = await response.json();

        setCreatedAccountn(true);
      } catch (err) {
        // Check if it's a MongoDB duplicate key error
        if (err.message.includes("E11000 duplicate key error")) {
          // Extract the duplicate key field and value using regex
          const match = err.message.match(/\{ *([^:]+): *"([^"]+)" *\}/); // Finds the text inside the first `{}`

          if (match && match.length >= 3) {
            // match[1] will be the key, match[2] will be the value
            const key = match[1].trim();
            const value = match[2].trim();

            if (key === "email") {
              newErrors[`${key}`] = "The email address you have provided is already in use.";
              setErrors(newErrors);
              console.log(newErrors);
            }
          }
        }
      }

      // Do the actual form submission here, e.g., send data to backend
    }
  };

  useEffect(() => {
    if (createdAccount) {
      // Show loading for 3 seconds before displaying the success message
      const timer = setTimeout(() => {
        setAccountMessage(true);

        setTimeout(() => {
          setFormData(initialFormData);
          setErrors({});
          setCreatedAccountn(true);
          setAccountMessage(false);
          setSignupConsole(false);
        }, 3000);
      }, 3000);

      return () => clearTimeout(timer); // Clean up the timer when the component unmounts
    }
  }, [createdAccount]);

  return (
    <div className="form_container">
      {!createdAccount ? (
        <div className="form_create">
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName} // Corrected binding
                onChange={handleInputChange}
              />
              {errors.firstName && <p style={{ color: "red" }}>{errors.firstName}</p>}
            </div>
            <div className="secName">
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Last Name"
                value={formData.lastName} // Corrected binding
                onChange={handleInputChange}
              />
              {errors.lastName && <p style={{ color: "red" }}>{errors.lastName}</p>}
            </div>
            <div className="dob-control">
              <span>
                <label htmlFor="date">Date of Birth</label> {/* Fixed `for` to `htmlFor` */}
                <span>
                  <select
                    id="date"
                    name="date"
                    value={formData.DOB.day}
                    onChange={(e) => handleDOBChange(e, "day")}
                  >
                    {Array.from({ length: 31 }, (_, i) => (
                      <Dates val={i + 1} key={i} />
                    ))}
                  </select>

                  <select
                    id="month"
                    name="Month"
                    value={formData.DOB.month}
                    onChange={(e) => handleDOBChange(e, "month")}
                  >
                    {months.map((month, i) => (
                      <Dates val={month} key={i} />
                    ))}
                  </select>

                  <select
                    id="year"
                    name="year"
                    value={formData.DOB.year}
                    onChange={(e) => handleDOBChange(e, "year")}
                  >
                    {Array.from({ length: 120 }, (_, i) => (
                      <Dates val={currentYear - i} key={currentYear - i} />
                    ))}
                  </select>
                </span>
                {errors.DOB && <p style={{ color: "red", position: "absolute" }}>{errors.DOB}</p>}
              </span>
            </div>
            <div className="gender-control">
              <span>
                <label htmlFor="gender">Gender</label> {/* Fixed `for` to `htmlFor` */}
                <div className="gender-option">
                  <span>
                    <input type="radio" value="Male" name="gender" onChange={handleInputChange} />
                    Male
                  </span>
                  <span>
                    <input type="radio" value="Female" name="gender" onChange={handleInputChange} />
                    Female
                  </span>
                </div>
                {/* {errors.DOB && <p style={{ color: "red", position: "absolute" }}>{errors.DOB}</p>} */}
              </span>
            </div>
            <div className="em-pas">
              <input
                type="email"
                name="email"
                placeholder="email ID"
                id="full-input"
                value={formData.email} // Added value binding for email
                onChange={handleInputChange}
              />
              {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
            </div>
            <div className="em-pas">
              <CreatePassword
                name="password"
                placeholder="please enter your new password"
                value={formData.password}
                handle={handleInputChange}
                id="password-1"
              />
              {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
            </div>
            <div className="em-pas">
              <CreatePassword
                name="confirmpassword"
                placeholder="Re-enter password"
                value={formData.confirmpassword}
                handle={handleInputChange}
                id="password-2"
              />
              {errors.confirmpassword && <p style={{ color: "red" }}>{errors.confirmpassword}</p>}
            </div>
            <span className="submit-btn">
              <input type="submit" />
              <CreateBtn setSignupConsole={setSignupConsole}>Close</CreateBtn>
            </span>
          </form>
        </div>
      ) : (
        <div className="loading-function">
          {!accountMessage ? (
            <img src="/svg/loading.svg" alt="" />
          ) : (
            <p style={colorGreen}>
              Your account has been created. You will be redirected to the login console in three
              seconds.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const Dates = function ({ val }) {
  return <option value={val}>{val}</option>;
};

export const CreatePassword = function ({ name, placeholder, value, handle, id }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        minLength={5}
        maxLength={25}
        value={value}
        onChange={handle}
        id={id}
      />
      <span
        style={{ position: "absolute", right: 10, top: 15, cursor: "pointer", fontSize: "1.3rem" }}
        className="hideicon"
        onClick={() => setShowPassword((s) => !showPassword)}
      >
        {showPassword ? "Hide" : "Show"}
      </span>
    </div>
  );
};

const CreateBtn = function ({ children, setSignupConsole }) {
  return (
    <button
      type="button"
      onClick={() => {
        setSignupConsole(false);
      }}
    >
      {children}
    </button>
  );
};

export default AccountForm;
