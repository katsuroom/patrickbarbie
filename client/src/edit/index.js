"use client"

import React, { createContext, useState } from "react";

const EditContext = createContext();

export const EditActionType = {
  GET_LOGGED_IN: "GET_LOGGED_IN",
};

function EditContextProvider(props) {
  const [edit, setEdit] = useState({
    user: null
  });

  const editReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      case EditActionType.GET_LOGGED_IN: {
        return setEdit({
        });
      }
      default:
        return edit;
    }
  };

  return (
    <EditContext.Provider value={{ edit }} >
      {props.children}
    </EditContext.Provider>
  );
}

export default EditContext;
export { EditContextProvider };