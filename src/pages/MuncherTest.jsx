import { Box } from "@mui/material";
import {
  currentProjectContext,
  bcvContext,
  debugContext,
  i18nContext,
  Header,
} from "pankosmia-rcl";
import { useContext, useState, useEffect } from "react";
import { getJson } from "pankosmia-lib/http";
import { WrapperNav } from "../components/obsArticlesMuncher/wrapperMuncher/WrapperNav";
import { Padding } from "@mui/icons-material";
import OBSContext from "../components/obsArticlesMuncher/muncher/context/obsContext";
import OBSArticlesViewerMuncher from "../components/obsArticlesMuncher/muncher/Viewer/OBSArticlesViewerMuncher";

export function MuncherTest() {
  const { obs, setObs } = useContext(OBSContext);
  const { bcvRef } = useContext(bcvContext);
  const { currentProjectRef } = useContext(currentProjectContext);
  const { debugRef } = useContext(debugContext);
  const { i18nRef } = useContext(i18nContext);
  const [currentBurrito, setCurrentBurrito] = useState(null);
  const [modified, setModified] = useState(false);

  useEffect(() => {
    async function getSummary() {
      if (currentProjectRef.current) {
        const projectPath = `${currentProjectRef.current.source}/${currentProjectRef.current.organization}/${currentProjectRef.current.project}`;
        const fullMetadataResponse = await getJson(
          `/api/burrito/metadata/summary/${projectPath}`,
        );
        if (fullMetadataResponse.ok) {
          const entry = fullMetadataResponse.json;
          setCurrentBurrito([projectPath, entry]);
        } else {
          enqueueSnackbar(
            `${doI18n("pages:core-contenthandler_juxta:error", i18nRef.current)}: ${fullMetadataResponse.status}`,
            { variant: "error" },
          );
        }
      }
    }

    getSummary();
  }, [currentProjectRef.current]);

  const metadata = currentBurrito && {
    local_path: currentBurrito[0],
    ...currentBurrito[1],
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box>
        <Header
          titleKey={"pages:core-contenthandler-obs_articles:titleMuncherTest"}
          currentId="content"
          requireNet={false}
        />
      </Box>
      <Box sx={{ paddingLeft: 2, paddingTop: 2, flexShrink: 0 }}>
        <WrapperNav flavor={"x-obsarticles"} obs={obs} setObs={setObs} />
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        {metadata && (
          <Box sx={{ flex: 1, margin: 2 }}>
            <OBSArticlesViewerMuncher
              metadata={metadata}
              debugRef={debugRef}
              obs={obs}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
