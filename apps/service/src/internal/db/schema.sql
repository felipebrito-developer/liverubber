-- LiveRubber Database Schema
-- First structure · 2026-03

CREATE TABLE IF NOT EXISTS asset (
  asset_id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  name       VARCHAR NOT NULL,
  file_path  TEXT    NOT NULL,
  media_type VARCHAR NOT NULL,
  created_at DATETIME
);

CREATE TABLE IF NOT EXISTS category_type (
  category_id    INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
  name           VARCHAR NOT NULL,
  category_color VARCHAR NOT NULL,
  description    VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS frequency_type (
  frequency_id    INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  type            VARCHAR NOT NULL,
  name            VARCHAR NOT NULL,
  frequency_period VARCHAR NOT NULL,
  amount          INTEGER NOT NULL,
  repeat          BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS tag_type (
  tag_id    INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
  color_hex VARCHAR NOT NULL,
  name      VARCHAR NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS meaning (
  meaning_id    INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
  category_id   INTEGER,
  name          VARCHAR NOT NULL,
  description   TEXT    NOT NULL,
  external_link VARCHAR,
  FOREIGN KEY(category_id) REFERENCES category_type(category_id)
);

CREATE TABLE IF NOT EXISTS meaning_assets (
  meaning_id INTEGER NOT NULL,
  asset_id   INTEGER NOT NULL,
  PRIMARY KEY (meaning_id, asset_id),
  FOREIGN KEY(meaning_id) REFERENCES meaning(meaning_id),
  FOREIGN KEY(asset_id)   REFERENCES asset(asset_id)
);

CREATE TABLE IF NOT EXISTS goal (
  goal_id        INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
  meaning_id     INTEGER,
  name           VARCHAR NOT NULL,
  description    TEXT    NOT NULL,
  status         VARCHAR NOT NULL,
  due_date       DATETIME,
  progress       INTEGER NOT NULL,
  cover_image_id INTEGER,
  FOREIGN KEY(meaning_id)     REFERENCES meaning(meaning_id),
  FOREIGN KEY(cover_image_id) REFERENCES asset(asset_id)
);

CREATE TABLE IF NOT EXISTS goal_assets (
  goal_id  INTEGER NOT NULL,
  asset_id INTEGER NOT NULL,
  PRIMARY KEY (goal_id, asset_id),
  FOREIGN KEY(goal_id)  REFERENCES goal(goal_id),
  FOREIGN KEY(asset_id) REFERENCES asset(asset_id)
);

CREATE TABLE IF NOT EXISTS habit (
  habit_id     INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
  meaning_id   INTEGER,
  frequency_id INTEGER,
  name         VARCHAR  NOT NULL,
  start_date   DATETIME,
  last_update  DATETIME,
  streak_count INTEGER  NOT NULL,
  FOREIGN KEY(meaning_id)   REFERENCES meaning(meaning_id),
  FOREIGN KEY(frequency_id) REFERENCES frequency_type(frequency_id)
);

CREATE TABLE IF NOT EXISTS task (
  task_id        INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
  goal_id        INTEGER,
  parent_task_id INTEGER,
  title          VARCHAR NOT NULL,
  description    TEXT    NOT NULL,
  status         VARCHAR,
  due_date       DATE,
  priority       VARCHAR,
  FOREIGN KEY(goal_id)        REFERENCES goal(goal_id),
  FOREIGN KEY(parent_task_id) REFERENCES task(task_id)
);

CREATE TABLE IF NOT EXISTS event (
  event_id     INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
  category_id  INTEGER  NOT NULL,
  frequency_id INTEGER  NOT NULL UNIQUE,
  title        VARCHAR  NOT NULL,
  start_date   DATETIME NOT NULL,
  end_date     DATETIME,
  location     VARCHAR,
  link         VARCHAR,
  FOREIGN KEY(category_id)  REFERENCES category_type(category_id),
  FOREIGN KEY(frequency_id) REFERENCES frequency_type(frequency_id)
);

CREATE TABLE IF NOT EXISTS reward (
  reward_id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
  description TEXT    NOT NULL,
  name        VARCHAR NOT NULL,
  type        VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS milestone (
  milestone_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
  goal_id      INTEGER,
  reward_id    INTEGER NOT NULL,
  name         VARCHAR NOT NULL,
  description  TEXT,
  type         VARCHAR NOT NULL,
  is_completed BOOLEAN NOT NULL,
  FOREIGN KEY(goal_id)   REFERENCES goal(goal_id),
  FOREIGN KEY(reward_id) REFERENCES reward(reward_id)
);

CREATE TABLE IF NOT EXISTS resource_type (
  resource_type_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  amount_type      VARCHAR NOT NULL,
  name             TEXT    NOT NULL,
  description      TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS resource_store (
  resource_id      INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
  resource_type_id INTEGER NOT NULL,
  amount           FLOAT   NOT NULL,
  FOREIGN KEY(resource_type_id) REFERENCES resource_type(resource_type_id)
);

CREATE TABLE IF NOT EXISTS resources_assignments (
  id             INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
  resource_id    INTEGER NOT NULL,
  entity_related_id INTEGER NOT NULL,
  relation_type  VARCHAR NOT NULL,
  amount         FLOAT,
  is_completed   BOOLEAN NOT NULL,
  FOREIGN KEY(resource_id) REFERENCES resource_store(resource_id)
);

CREATE TABLE IF NOT EXISTS activity (
  activity_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
  title       VARCHAR NOT NULL,
  description TEXT    NOT NULL,
  icon_name   VARCHAR NOT NULL,
  tag_id      INTEGER NOT NULL,
  FOREIGN KEY(tag_id) REFERENCES tag_type(tag_id)
);

CREATE TABLE IF NOT EXISTS activity_log (
  activity_log_id INTEGER  PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
  activity_id     INTEGER  NOT NULL,
  task_id         INTEGER,
  habit_id        INTEGER,
  completed_at    DATETIME NOT NULL,
  amount_achieved FLOAT    NOT NULL,
  mood_rating     INTEGER  NOT NULL,
  FOREIGN KEY(activity_id) REFERENCES activity(activity_id),
  FOREIGN KEY(task_id)     REFERENCES task(task_id),
  FOREIGN KEY(habit_id)    REFERENCES habit(habit_id)
);

CREATE TABLE IF NOT EXISTS resource_log (
  id            INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
  resource_id   INTEGER NOT NULL,
  amount_change FLOAT   NOT NULL,
  change_type   VARCHAR NOT NULL,
  log_date      DATETIME,
  FOREIGN KEY(resource_id) REFERENCES resource_store(resource_id)
);
