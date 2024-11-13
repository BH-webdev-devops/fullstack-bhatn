import React from 'react';

export const DeleteIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-trash-2"
    >
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"></path>
        <path d="M10 11l1 9"></path>
        <path d="M14 11l-1 9"></path>
        <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
    </svg>
);



export const CancelIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="red"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-x"
    >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);


export const TodoIcon = () => (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 40 40"
    fill="green"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-check-square"
>
    <path d="M9 11l3 3L22 4"></path>
    <path d="M21 14v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
</svg>
);

export const CalendarIcon = (date: Date) => {
    const today = date;
    const month = today.toLocaleString('default', { month: 'long' });
    const year = today.getFullYear();
    const day = today.getDate();
  
    return (
        <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 100 100"
      fill="blue"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-calendar"
    >
      <rect x="10" y="20" width="80" height="70" rx="10" ry="10" fill="white" stroke="gray"></rect>
      <line x1="10" y1="30" x2="90" y2="30" stroke="black"></line>
      <text x="50" y="15" textAnchor="middle" fontSize="20" fill="red">{month.slice(0, 3)} {year}</text>
      <text x="50" y="50" textAnchor="middle" fontSize="30" fill="black">{day}</text>
    </svg>
    );
  };

export const EditIcon = () => {return (
<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
fill="gray"
className="w-6 h-6"
>
<path d="M4 21v-2.586l12.293-12.293 2.586 2.586L6.586 21H4zm16.707-16.707a1 1 0 0 0 0-1.414l-2.586-2.586a1 1 0 0 0-1.414 0L14.586 4.586l4 4L20.707 4.293z" />
</svg>)}
