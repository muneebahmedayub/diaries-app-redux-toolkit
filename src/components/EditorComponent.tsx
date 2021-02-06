import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Button,
} from "@material-ui/core";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/rootReducer";
import http from "../services/api";
import { Entry } from "../interfaces/entry.interface";
import { Diary } from "../interfaces/diary.interface";
import { useAppDispatch } from "../redux/store";
import { addEntry, updateEntry } from "../redux/reducers/entriesSlice";
import { updateDiary } from "../redux/reducers/diariesSlice";

const EditorComponent = () => {
  const { diaryId, entryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const diaries = useSelector((state: RootState) => state.diaries);
  const currentDiaryArray = diaries.filter((diary) => diary.id === diaryId);

  const [editedEntry, setEditedEntry] = useState<{
    title: string;
    content: string;
  }>({
    title: "",
    content: "",
  });
  useEffect(() => {
    if (currentDiaryArray.length === 0) {
      navigate("/");
    } else if (entryId !== "0") {
      const fetchEntries = async () => {
        const { entries: _entries } = await http.get<
          null,
          { entries: Entry[] }
        >(`/entries/${diaryId}`);
        const currentEntry = _entries.filter(
          (entry) => entry.id === entryId
        )[0];
        setEditedEntry({
          title: currentEntry.title,
          content: currentEntry.content,
        });
      };
      fetchEntries();
    }
  }, [currentDiaryArray.length, diaryId, entryId, navigate]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const path =
      entryId === "0" ? `/entries/${diaryId}` : `/entries/${entryId}`;
    if (entryId === "0") {
      const data = await http.post<Entry, { diary: Diary; entry: Entry }>(
        path,
        editedEntry
      );
      if (data !== null) {
        const { diary, entry } = data;
        dispatch(addEntry(entry));
        dispatch(updateDiary(diary));
      }
    } else {
      const entry = await http.patch<Entry, Entry>(path, editedEntry);
      if (entry !== null) {
        dispatch(updateEntry(entry));
      }
    }
    navigate(`/entries/${diaryId}`);
  };
  return (
    <Container>
      {/* <Breadcrumbs style={{ marginTop: 20 }}>
        <Link
          color="inherit"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Diaries
        </Link>
        <Typography color="textPrimary">
          {currentDiary ? currentDiary.title : null}
        </Typography>
      </Breadcrumbs> */}
      <form onSubmit={handleSubmit}>
        <Card style={{ marginTop: 20 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="Title"
                  placeholder="Title"
                  value={editedEntry.title}
                  onChange={(e) =>
                    setEditedEntry((prevState) => ({
                      ...prevState,
                      title: e.target.value,
                    }))
                  }
                  required
                  fullWidth
                ></TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="Content"
                  placeholder="Supports Markdown!"
                  multiline
                  rows={10}
                  value={editedEntry.content}
                  onChange={(e) =>
                    setEditedEntry((prevState) => ({
                      ...prevState,
                      content: e.target.value,
                    }))
                  }
                  required
                  fullWidth
                ></TextField>
              </Grid>
            </Grid>
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
                <Button variant="contained" color="primary" type="submit">
                  {entryId === "0" ? "Create Entry" : "Update Entry"}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </Container>
  );
};

export default EditorComponent;
