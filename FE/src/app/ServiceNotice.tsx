import { Button, Notice } from "../ui";
import { useServiceHealth } from "./useServiceHealth";

/** Warns early when the backend is down, before someone fills in the form. */
export function ServiceNotice() {
  const { health, recheck } = useServiceHealth();
  if (health !== "offline") return null;

  return (
    <div className="mb-8">
      <Notice
        tone="error"
        title="Can't reach the analysis service"
        action={
          <Button variant="secondary" onClick={recheck}>
            Check again
          </Button>
        }
      >
        You can fill in the form, but comparisons will fail until the service is back.
      </Notice>
    </div>
  );
}
