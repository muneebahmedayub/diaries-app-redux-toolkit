import React, { useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Fab,
  Zoom,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Button,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CreateIcon from "@material-ui/icons/Create";
import http from "../services/api";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/rootReducer";
import dayjs from "dayjs";
import { Diary } from "../interfaces/diary.interface";
import { User } from "../interfaces/user.interface";
import { useAppDispatch } from "../redux/store";
import Swal from "sweetalert2";
import { addDiary, addAll, updateDiary } from "../redux/reducers/diariesSlice";
import { useNavigate } from "react-router-dom";
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

const DiariesComponent = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { diaries, user } = useSelector((state: RootState) => state);

  useEffect(() => {
    const fetchDiaries = async () => {
      if (user) {
        const data = await http.get<null, { diaries: Diary[] }>(
          `/diaries/${user.id}`
        );
        if (data.diaries && data.diaries.length > 0) {
          const sortedDiaries = data.diaries.sort((a, b) => {
            return dayjs(b.updatedAt).unix() - dayjs(a.updatedAt).unix();
          });
          dispatch(addAll(sortedDiaries as Diary[]));
        } else {
          dispatch(addAll(null));
        }
      }
    };
    fetchDiaries();
    dispatch(setEntry(null))
  }, [dispatch, user]);

  const createDiary = async () => {
    const result: any = await Swal.mixin({
      input: "text",
      confirmButtonText: "Next →",
      showCancelButton: true,
      progressSteps: ["1", "2"],
    }).queue([
      {
        title: "Diary title",
        input: "text",
      },
      {
        titleText: "Private or Public diary?",
        input: "radio",
        inputOptions: {
          private: "Private",
          public: "Public",
        },
        inputValue: "private",
      },
    ]);
    if (result.value) {
      if (result.value[0].length !== 0) {
        const { value } = result;
        const { diary } = await http.post<
          Partial<Diary>,
          { diary: Diary; user: User }
        >("/diaries", {
          title: value[0],
          type: value[1],
          userId: user?.id,
        });
        if (diary && user) {
          dispatch(addDiary(diary as Diary));
          return Swal.fire({
            titleText: "All done!",
            confirmButtonText: "Ok!",
          });
        }
      } else {
        return Swal.fire({
          titleText: "Diary cannot be without name!",
        });
      }
    }
    Swal.fire({
      titleText: "Cancelled",
    });
  };

  const updateHandler = async (diary: Diary) => {
    const result: any = await Swal.mixin({
      input: "text",
      confirmButtonText: "Update",
      showCancelButton: true,
    }).queue([
      {
        title: "Update Diary",
        input: "text",
      },
    ]);
    if (result.value) {
      if (result.value[0].length !== 0) {
        const { value } = result;
        if (value[0] === diary.title) {
          return Swal.fire({
            titleText: "You entered the same name",
            confirmButtonText: "Ok!",
          });
        }
        const diaryObj: Diary = {
          ...diary,
          title: value[0],
        };
        const diaryRes = await http.patch<Diary, Diary>(
          `/diaries/${diary.id}`,
          diaryObj
        );
        dispatch(updateDiary(diaryRes));
        return Swal.fire({
          titleText: "Diary Updated",
          confirmButtonText: "Ok!",
        });
      } else {
        return Swal.fire({
          titleText: "Diary cannot be updated without any title",
          confirmButtonText: "Ok!",
        });
      }
    }
    Swal.fire({
      titleText: "Cancelled",
    });
  };

  return (
    <Container>
      <Grid
        container
        spacing={3}
        style={{ marginTop: 50, marginBottom: 50, padding: "0px 10px" }}
      >
        {diaries.map((diary) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={diary.id}>
              <Card>
                <CardContent>
                  <Grid container>
                    <Grid item xs={10}>
                      <Typography
                        variant="h5"
                        style={{ textTransform: "uppercase" }}
                      >
                        {diary.title}
                      </Typography>
                      <Typography variant="subtitle2">
                        {/* {diary.updatedAt} */}
                        {dayjs(diary.updatedAt).format(
                          "ddd, MMM D, YYYY h:mm A"
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton onClick={() => updateHandler(diary)}>
                        <CreateIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/entries/${diary.id}`)}
                  >
                    Entries
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Zoom in unmountOnExit>
        <Fab className={classes.fab} color="secondary" onClick={createDiary}>
          <CreateIcon />
        </Fab>
      </Zoom>
    </Container>
  );
};

export default DiariesComponent;
