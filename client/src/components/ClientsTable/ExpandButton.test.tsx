import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ExpandButton } from "./ExpandButton";

describe("ExpandButton", () => {
  it("exposes collapsed state to assistive technology", () => {
    render(
      <ExpandButton expanded={false} label="Branch 1" onToggle={() => undefined} />,
    );

    const button = screen.getByRole("button", { name: "Expand Branch 1" });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("exposes expanded state to assistive technology", () => {
    render(
      <ExpandButton expanded label="Company" onToggle={() => undefined} />,
    );

    const button = screen.getByRole("button", { name: "Collapse Company" });
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("calls onToggle when activated with pointer or keyboard", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(<ExpandButton expanded={false} label="Branch 1" onToggle={onToggle} />);

    const button = screen.getByRole("button", { name: "Expand Branch 1" });

    await user.click(button);
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onToggle).toHaveBeenCalledTimes(3);
  });
});
