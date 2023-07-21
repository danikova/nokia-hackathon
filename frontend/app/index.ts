import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';

import 'highlight.js/styles/agate.css';

hljs.registerLanguage('bash', bash);

dayjs.extend(relativeTime);
