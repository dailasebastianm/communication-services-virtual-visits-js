// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Spinner, Stack, ThemeProvider } from '@fluentui/react';
import { backgroundStyles, fullSizeStyles } from './styles/Common.styles';
import { Header } from './Header';
import './styles/Common.css';
import { fetchConfig } from './utils/FetchConfig';
import { AppConfigModel } from './models/ConfigModel';
import { GenericError } from './components/GenericError';
import { useEffect, useState } from 'react';
import { BookingsPage } from './components/Book/BookingsPage';
import { NoSchedulingPage } from './components/Book/NoSchedulingPage';

export const Book = (): JSX.Element => {
  const [config, setConfig] = useState<AppConfigModel | undefined>(undefined);
  const [error, setError] = useState<any | undefined>(undefined);

  const PARENT_ID = 'BookMeetingSection';

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const fetchedConfig = await fetchConfig();
        setConfig(fetchedConfig);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };

    fetchData();
  }, []);

  if (config) {
    return (
      <ThemeProvider theme={config.theme} style={{ height: '100%' }}>
        <Stack styles={backgroundStyles(config.theme)}>
          <Header companyName={config.companyName} parentid={PARENT_ID} />
          {config.microsoftBookingsUrl ? <BookingsPage config={config} /> : <NoSchedulingPage config={config} />}
        </Stack>
      </ThemeProvider>
    );
  }

  if (error) {
    return <GenericError statusCode={error.statusCode} />;
  }

  return <Spinner styles={fullSizeStyles} />;
};
