import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  Container,
  Typography,
  Grid,
  Button,
} from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/rootReducer";
import Markdown from "markdown-to-jsx";

const EntryDetails = () => {
  const { diaryId, entryId } = useParams();
  const navigate = useNavigate();
  const { diaries, entries } = useSelector((state: RootState) => state);
  const currentDiaryArray = diaries.filter((diary) => diary.id === diaryId);
  const currentEntryArray = entries.filter((entry) => entry.id === entryId);

  const entry = currentEntryArray[0];

  useEffect(() => {
    if (currentEntryArray.length === 0) {
      if (currentDiaryArray.length === 0) {
        navigate("/");
      }
      navigate(`/entries/${diaryId}`);
    }
  }, [
    currentDiaryArray.length,
    currentEntryArray.length,
    diaryId,
    entryId,
    navigate,
  ]);
  return (
    <Container>
      <Card style={{ marginTop: 20, marginBottom: 20 }}>
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            style={{ flex: 1 }}
            gutterBottom
          >
            {entry.title}
          </Typography>
          <Markdown>{entry.content}</Markdown>
          <Grid container justify="space-between" style={{ marginTop: 20 }}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate(`/entries/${diaryId}`)}
              >
                Back
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/editor/${diaryId}/${entryId}`)}
              >
                {entryId === "0" ? "Create Entry" : "Update Entry"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EntryDetails;
