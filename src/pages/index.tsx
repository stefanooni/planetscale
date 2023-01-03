import { lesson } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState<lesson[] | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fetchCount, setFetchCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onClick = () => {
    if (!loading) {
      setLoading(true);
      axios
        .post<lesson, AxiosResponse<lesson>, Partial<lesson>>(
          "/api/create-lesson",
          {
            title,
            description,
          }
        )
        .then(() => {
          setFetchCount((i) => i + 1);
          setTitle("");
          setDescription("");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (fetchCount > 0) {
      setRefreshing(true);
    }
    axios
      .get("/api/get-lessons")
      .then(({ data: { lessons } }: AxiosResponse<{ lessons: lesson[] }>) => {
        setLessons(lessons);
      })
      .finally(() => {
        setRefreshing(false);
      });
  }, [fetchCount]);

  const lessonRender = useMemo(() => {
    if (!lessons) {
      return <p>Loading...</p>;
    }
    if (lessons.length === 0) {
      return <p>No lessons</p>;
    }

    return lessons.map((lesson) => (
      <div key={lesson.id}>
        <h3>{lesson.title}</h3>
        <p>{lesson.description}</p>
      </div>
    ));
  }, [lessons]);

  return (
    <main>
      <div>
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.currentTarget.value);
          }}
          placeholder="Lesson name"
        />
        <input
          value={description}
          onChange={(e) => {
            setDescription(e.currentTarget.value);
          }}
          placeholder="Lesson description"
        />
        <button onClick={onClick}>
          {loading ? "Creating..." : "Create lesson"}
        </button>
      </div>
      <h1>Lessons</h1>
      {lessonRender}
      {refreshing && <p style={{ marginTop: 10 }}>Refreshing...</p>}
    </main>
  );
};

export default Home;
