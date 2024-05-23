import { useState } from "react";

interface IDistanceButtonProps {
  // Props for the distance button component
  distance: string;
  // Boolean to check if the button is active
  active: boolean;
  // Method to handle distance selection
  onDistanceSelected: (distance: string) => void;
}
export default function DistanceButton(props: IDistanceButtonProps) {
  {
    // State to keep track of selected distance
    const [selected, setSelected] = useState(false);

    // Method to handle button click
    const handleClick = () => {
      setSelected(!selected);
      props.onDistanceSelected(props.distance);
    };

    return (
      <div>
        <button
          onClick={handleClick}
          className={`${
            props.active ? "bg-yellow-400" : "bg-slate-700"
          } h-12 w-12 rounded-lg `}
        >
          {props.distance}
        </button>
      </div>
    );
  }
}
