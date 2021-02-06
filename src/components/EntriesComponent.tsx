import React, { useEffect } from "react";
import {
  Breadcrumbs,
  Container,
  Grid,
  Link,
  Typography,
  Zoom,
  Fab,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Button,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CreateIcon from "@material-ui/icons/Create";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/rootReducer";
import http from "../services/api";
import { Entry } from "../interfaces/entry.interface";
import dayjs from "dayjs";
import { useAppDispatch } from "../redux/store";
import { setEntry } from "../redux/reducers/entriesSlice";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: "fixed",
      bottom: theme.spacing(3),
      right: theme.spacing(3),
    },
  })
);

const EntriesComponent = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { diaryId } = useParams();
  const { diaries, entries } = useSelector((state: RootState) => state);
  const currentDiaryArray = diaries.filter((diary) => diary.id === diaryId);

  useEffect(() => {
    if (currentDiaryArray.length === 0) {
      navigate("/");
    } else {
      const fetchEntries = async () => {
        const { entries: _entries } = await http.get<
          null,
          { entries: Entry[] }
        >(`/entries/${diaryId}`);

        if (_entries && _entries.length > 0) {
          const sortedEntries = _entries.sort((a, b) => {
            return dayjs(b.updatedAt).unix() - dayjs(a.updatedAt).unix();
          });
          dispatch(setEntry(sortedEntries));
        } else {
          dispatch(setEntry(null));
        }
      };
      fetchEntries();
    }
  }, []);
  const currentDiary = currentDiaryArray[0];

  return (
    <Container>
      <Breadcrumbs style={{ marginTop: 20 }}>
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
      </Breadcrumbs>
      <Grid container spacing={3} style={{ marginTop: 10 }}>
        {entries.map((entry) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={entry.id}>
              <Card>
                <CardContent>
                  <Grid container>
                    <Grid item xs={10}>
                      <Typography
                        variant="h5"
                        style={{ textTransform: "uppercase" }}
                      >
                        {entry.title}
                      </Typography>
                      <Typography variant="subtitle2">
                        {/* {diary.updatedAt} */}
                        {dayjs(entry.updatedAt).format(
                          "ddd, MMM D, YYYY h:mm A"
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton
                        onClick={() =>
                          navigate(`/editor/${diaryId}/${entry.id}`)
                        }
                      >
                        <CreateIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() =>
                      navigate(`/entry-details/${diaryId}/${entry.id}`)
                    }
                  >
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Zoom in unmountOnExit>
        <Fab
          className={classes.fab}
          color="secondary"
          onClick={() => navigate(`/editor/${diaryId}/0`)}
        >
          <CreateIcon />
        </Fab>
      </Zoom>
    </Container>
  );
};

export default EntriesComponent;
