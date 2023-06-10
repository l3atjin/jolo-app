import React, { useState } from "react";
import { Dropdown } from "./Dropdown";
import TextInputField from "./TextInputField";

export default function RiderForm() {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  // should be a date object here
  const [date, setDate] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [description, setDescription] = useState("");

  const timeOfDayOptions = ["morning", "afternoon", "evening", "flexible"];

  console.log("in riderform");

  return (
    <>
      <TextInputField
        label="Departure"
        value={departure}
        onChange={setDeparture}
      />
      <TextInputField
        label="Destination"
        value={destination}
        onChange={setDestination}
      />
      <TextInputField label="Date" value={date} onChange={setDate} />
      <Dropdown
        label="Time of day"
        value={timeOfDay}
        onChange={setTimeOfDay}
        options={timeOfDayOptions}
      />
      <TextInputField
        label="Description"
        value={description}
        onChange={setDescription}
      />
    </>
  );
}
