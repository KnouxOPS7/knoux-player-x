import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { NeonButton } from "../../../src/ui/components/neon/NeonButton";

describe("UI: NeonButton", () => {
    test("renders children correctly", () => {
        render(<NeonButton>Click Me</NeonButton>);
        expect(screen.getByText("Click Me")).toBeInTheDocument();
    });

    test("handles click events", () => {
        const handleClick = jest.fn();
        render(<NeonButton onClick={handleClick}>Action</NeonButton>);
        
        fireEvent.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test("shows processing state", () => {
        render(<NeonButton isProcessing={true}>Go</NeonButton>);
        expect(screen.getByText("PROCESSING...")).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeDisabled();
    });
});
