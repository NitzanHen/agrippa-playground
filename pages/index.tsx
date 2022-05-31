import type { NextPage } from 'next';
import { useState } from 'react';
import useSWR from 'swr';
import type { AgrippaDir, AgrippaFile, Config, InputConfig } from 'agrippa';
import { Code } from '../components/Code';

async function fetcher<T>(url: string, method: string, body?: any): Promise<T> {
  const res = await fetch(url, {
    method,
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
}

/** @todo define this in Agrpipa */
type AgrippaOutput = {
  logs: string;
  config: Config;
  createdFiles: AgrippaFile[];
  createdDirs: AgrippaDir[];
  variables: Record<string, any>;
};

const defaultInputConfig = (): InputConfig => ({
  name: 'nice-component',
  environment: 'react',
  styling: 'scss'
});

const URL = 'https://agrippa-run.netlify.app/.netlify/functions/run';

const Home: NextPage = () => {

  const [inputConfig, setInputConfig] = useState(defaultInputConfig);

  const { data, error } = useSWR(URL, url => fetcher<AgrippaOutput>(url, 'POST', inputConfig), {
    shouldRetryOnError: false,
  });

  const isLoading = !data && !error;

  const [currentFile, setCurrentFile] = useState<AgrippaFile | null>(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
    return <div>Error</div>;
  }

  const { createdFiles, createdDirs, variables, logs, config } = data!;

  const extension = currentFile?.path.slice(currentFile!.path.lastIndexOf('.') + 1);

  return (
    <div>
      {createdFiles.map(file => (
        <button
          key={file.path}
          onClick={() => setCurrentFile(file)}>
          {file.path}
        </button>
      ))}
      <p>{currentFile && <Code code={currentFile.data} language={extension} />}</p>
      <p>{createdDirs && JSON.stringify(createdDirs, null, 2)}</p>
      <p>{variables && JSON.stringify(variables, null, 2)}</p>
      <p>{logs}</p>
      <p>{config && JSON.stringify(config, null, 2)}</p>
    </div>
  );
};

export default Home;
