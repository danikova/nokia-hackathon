'use client';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import hljs from 'highlight.js/lib/core';
import yaml from 'highlight.js/lib/languages/yaml';

import 'highlight.js/styles/agate.css';

hljs.registerLanguage('yaml', yaml);

dayjs.extend(relativeTime);
