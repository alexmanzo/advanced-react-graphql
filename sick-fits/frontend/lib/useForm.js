/**
 * @file useForm custom hook.
 *
 * Custom hook for managing form input.
 */

import { useState } from 'react';

export default function useForm(initial = {}) {
  // We can pass in an initial form state if we have default values.
  const [inputs, setInputs] = useState(initial);

  // Function to be called from onChange events.
  function handleChange(e) {
    let { value, name, type } = e.target;

    // Return a number from an integer field.
    if (type === 'number') {
      value = parseInt(value);
    }

    if (type === 'file') {
      // We're destructuring to get the first item of the array.
      [value] = e.target.files;
    }

    setInputs({
      ...inputs,
      // Dynamically set key to name of input.
      [name]: value,
    });
  }

  // Reset to initial values.
  function resetForm() {
    setInputs(initial);
  }

  // Clear entire form.
  function clearForm() {
    /*
     * Object.entries returns an array of arrays with both keys and values.
     * We are simply using it to reset the values, then turn it back into an
     * object again and set our inputs from that.
     */
    const blankState = Object.entries(inputs).map(([key, value]) => [key, '']);

    setInputs(Object.fromEntries(blankState));
  }

  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
