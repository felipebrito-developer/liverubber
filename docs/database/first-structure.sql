DROP TABLE IF EXISTS asset;
DROP TABLE IF EXISTS category_type;
DROP TABLE IF EXISTS frequency_type;
DROP TABLE IF EXISTS tag_type;
DROP TABLE IF EXISTS meaning;
DROP TABLE IF EXISTS meaning_assets;
DROP TABLE IF EXISTS goal;
DROP TABLE IF EXISTS goal_assets;
DROP TABLE IF EXISTS habit;
DROP TABLE IF EXISTS task;
DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS reward;
DROP TABLE IF EXISTS milestone;
DROP TABLE IF EXISTS resource_type;
DROP TABLE IF EXISTS resource_store;
DROP TABLE IF EXISTS resources_assignments;
DROP TABLE IF EXISTS activity;
DROP TABLE IF EXISTS activity_log;
DROP TABLE IF EXISTS resource_log;


CREATE TABLE asset (
id VARCHAR PRIMARY KEY NOT NULL,
name VARCHAR NOT NULL,
file_path TEXT NOT NULL,
media_type VARCHAR NOT NULL,
created_at DATETIME,
updated_at DATETIME);

CREATE TABLE category_type (
id VARCHAR PRIMARY KEY NOT NULL,
name VARCHAR NOT NULL,
category_color VARCHAR NOT NULL,
description VARCHAR NOT NULL,
created_at DATETIME,
updated_at DATETIME);

CREATE TABLE frequency_type (
id VARCHAR PRIMARY KEY NOT NULL,
type VARCHAR NOT NULL,
name VARCHAR NOT NULL,
frequency_period VARCHAR NOT NULL,
amount INTEGER NOT NULL,
repeat BOOLEAN NOT NULL,
created_at DATETIME,
updated_at DATETIME);

CREATE TABLE tag_type (
id VARCHAR PRIMARY KEY NOT NULL,
color_hex VARCHAR NOT NULL,
name VARCHAR NOT NULL UNIQUE,
created_at DATETIME,
updated_at DATETIME);

CREATE TABLE meaning (
id VARCHAR PRIMARY KEY NOT NULL,
category_id VARCHAR,
name VARCHAR NOT NULL,
description TEXT NOT NULL,
external_link VARCHAR,
created_at DATETIME,
updated_at DATETIME,
FOREIGN KEY(category_id) REFERENCES category_type(id));

CREATE TABLE meaning_assets (
meaning_id VARCHAR NOT NULL,
asset_id VARCHAR NOT NULL,
PRIMARY KEY (meaning_id,asset_id),
FOREIGN KEY(meaning_id) REFERENCES meaning(id),
FOREIGN KEY(asset_id) REFERENCES asset(id));

CREATE TABLE goal (
id VARCHAR PRIMARY KEY NOT NULL,
meaning_id VARCHAR,
name VARCHAR NOT NULL,
description TEXT NOT NULL,
status VARCHAR NOT NULL,
due_date DATETIME,
progress INTEGER NOT NULL,
cover_image_id VARCHAR,
created_at DATETIME,
updated_at DATETIME,
FOREIGN KEY(meaning_id) REFERENCES meaning(id),
FOREIGN KEY(cover_image_id) REFERENCES asset(id));

CREATE TABLE goal_assets (
goal_id VARCHAR NOT NULL,
asset_id VARCHAR NOT NULL,
PRIMARY KEY (goal_id,asset_id),
FOREIGN KEY(goal_id) REFERENCES goal(id),
FOREIGN KEY(asset_id) REFERENCES asset(id));

CREATE TABLE habit (
id VARCHAR PRIMARY KEY NOT NULL,
meaning_id VARCHAR,
frequency_id VARCHAR,
name VARCHAR NOT NULL,
start_date DATETIME,
last_update DATETIME,
streak_count INTEGER NOT NULL,
created_at DATETIME,
updated_at DATETIME,
FOREIGN KEY(meaning_id) REFERENCES meaning(id),
FOREIGN KEY(frequency_id) REFERENCES frequency_type(id));

CREATE TABLE task (
id VARCHAR PRIMARY KEY NOT NULL,
goal_id VARCHAR,
parent_task_id VARCHAR,
title VARCHAR NOT NULL,
description TEXT NOT NULL,
status VARCHAR,
due_date DATE,
priority VARCHAR,
created_at DATETIME,
updated_at DATETIME,
FOREIGN KEY(goal_id) REFERENCES goal(id),
FOREIGN KEY(parent_task_id) REFERENCES task(id));

CREATE TABLE event (
id VARCHAR PRIMARY KEY NOT NULL,
category_id VARCHAR NOT NULL,
frequency_id VARCHAR NOT NULL UNIQUE,
title VARCHAR NOT NULL,
start_date DATETIME NOT NULL,
end_date DATETIME,
location VARCHAR,
link VARCHAR,
created_at DATETIME,
updated_at DATETIME,
FOREIGN KEY(category_id) REFERENCES category_type(id),
FOREIGN KEY(frequency_id) REFERENCES frequency_type(id));

CREATE TABLE reward (
id VARCHAR PRIMARY KEY NOT NULL,
description TEXT NOT NULL,
name VARCHAR NOT NULL,
type VARCHAR NOT NULL,
created_at DATETIME,
updated_at DATETIME);

CREATE TABLE milestone (
id VARCHAR PRIMARY KEY NOT NULL,
goal_id VARCHAR,
reward_id VARCHAR NOT NULL,
name VARCHAR NOT NULL,
description TEXT,
type VARCHAR NOT NULL,
is_completed BOOLEAN NOT NULL,
created_at DATETIME,
updated_at DATETIME,
FOREIGN KEY(goal_id) REFERENCES goal(id),
FOREIGN KEY(reward_id) REFERENCES reward(id));

CREATE TABLE resource_type (
id VARCHAR PRIMARY KEY NOT NULL,
amount_type VARCHAR NOT NULL,
name TEXT NOT NULL,
description TEXT NOT NULL,
created_at DATETIME,
updated_at DATETIME);

CREATE TABLE resource_store (
id VARCHAR PRIMARY KEY NOT NULL,
resource_type_id VARCHAR NOT NULL,
amount FLOAT NOT NULL,
created_at DATETIME,
updated_at DATETIME,
FOREIGN KEY(resource_type_id) REFERENCES resource_type(id));

CREATE TABLE resources_assignments (
id VARCHAR PRIMARY KEY NOT NULL,
resource_id VARCHAR NOT NULL,
entity_related_id VARCHAR NOT NULL,
relation_type VARCHAR NOT NULL,
amount FLOAT,
is_completed BOOLEAN NOT NULL,
created_at DATETIME,
updated_at DATETIME,
FOREIGN KEY(resource_id) REFERENCES resource_store(id));

CREATE TABLE activity (
id VARCHAR PRIMARY KEY NOT NULL,
title VARCHAR NOT NULL,
description TEXT NOT NULL,
icon_name VARCHAR NOT NULL,
tag_id VARCHAR NOT NULL,
created_at DATETIME,
updated_at DATETIME,
FOREIGN KEY(tag_id) REFERENCES tag_type(id));

CREATE TABLE activity_log (
id VARCHAR PRIMARY KEY NOT NULL,
activity_id VARCHAR NOT NULL,
task_id VARCHAR,
habit_id VARCHAR,
completed_at DATETIME NOT NULL,
amount_achieved FLOAT NOT NULL,
mood_rating INTEGER NOT NULL,
created_at DATETIME,
updated_at DATETIME,
FOREIGN KEY(activity_id) REFERENCES activity(id),
FOREIGN KEY(task_id) REFERENCES task(id),
FOREIGN KEY(habit_id) REFERENCES habit(id));

CREATE TABLE resource_log (
id VARCHAR PRIMARY KEY NOT NULL,
resource_id VARCHAR NOT NULL,
amount_change FLOAT NOT NULL,
change_type VARCHAR NOT NULL,
log_date DATETIME,
created_at DATETIME,
updated_at DATETIME,
FOREIGN KEY(resource_id) REFERENCES resource_store(id));