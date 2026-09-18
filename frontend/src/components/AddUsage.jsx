import { useState } from "react";

function AddUsage() {
    
  return (
    <div>
      <select
      value={material}
      onChange={(e)=>setMaterial(e.target.value)}>
        
            <option>Select Material</option>
            </select>

            <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e)=>setQuantity(e.target.value)}
            />

            <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e)=>setLocation(e.target.value)}
            />
                </div>
  );
}

export default AddUsage;