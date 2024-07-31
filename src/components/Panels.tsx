import { useMemo, useRef } from "react";
import classNames from "classnames";
import { ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useUserOptions } from "../stores/user-options";
import { useIsMobile } from "../hooks/useIsMobile";

const defaultCodePanelSizePercentage = 50;
const mobileCodePanelSizePercentage = 60;

type PanelsProps = {
  editorChildren: React.ReactNode;
  rendererChildren: React.ReactNode;
};

export const Panels = ({ editorChildren, rendererChildren }: PanelsProps) => {
  const options = useUserOptions();
  const isMobile = useIsMobile();

  const direction = isMobile ? "vertical" : options.panels.splitDirection;
  const isVertical = direction === "vertical";

  const textEditorPanelRef = useRef<ImperativePanelHandle>(null);

  const panelGroupMembers = useMemo(() => {
    const members = [
      <Panel
        ref={textEditorPanelRef}
        key="panel-editor"
        defaultSize={isMobile ? mobileCodePanelSizePercentage : defaultCodePanelSizePercentage}
        collapsible
        collapsedSize={10}
        onCollapse={console.log}
        id="editor"
        order={isVertical ? 1 : 0}
      >
        {editorChildren}
      </Panel>,
      <PanelResizeHandle
        key="panel-resize-handle"
        onClick={() =>
          textEditorPanelRef.current?.isCollapsed()
            ? textEditorPanelRef.current?.expand()
            : textEditorPanelRef.current?.collapse()
        }
        className={classNames(
          isVertical ? "h-1.5" : "w-1.5",
          { "bg-gray-600": options.renderer.theme === "dark" },
          { "bg-gray-200": options.renderer.theme === "light" }
        )}
      />,
      <Panel key="panel-renderer" id="renderer" order={isVertical ? 0 : 1}>
        {rendererChildren}
      </Panel>,
    ];
    if (isVertical) members.reverse();
    return members;
  }, [isMobile, isVertical, editorChildren, options.renderer.theme, rendererChildren]);

  return (
    <PanelGroup autoSaveId="example" direction={direction}>
      {panelGroupMembers}
    </PanelGroup>
  );
};
