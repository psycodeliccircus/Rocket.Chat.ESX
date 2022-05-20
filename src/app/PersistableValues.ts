import type { Certificate } from 'electron';

import { Download } from '../downloads/common';
import { Server } from '../servers/common';
import { WindowState } from '../ui/common';

type PersistableValues_0_0_0 = {
  currentServerUrl: string;
  currentView: 'add-new-server' | null;
  doCheckForUpdatesOnStartup: boolean;
  allowedJitsiServers: Record<string, boolean>;
  externalProtocols: Record<string, boolean>;
  isAddNewServersEnabled: boolean;
  isEachUpdatesSettingConfigurable: boolean;
  isMenuBarEnabled: boolean;
  isShowWindowOnUnreadChangedEnabled: boolean;
  isSideBarEnabled: boolean;
  isTrayIconEnabled: boolean;
  isMinimizeOnCloseEnabled: boolean;
  isUpdatingEnabled: boolean;
  rootWindowState: WindowState;
  servers: Server[];
  skippedUpdateVersion: string | null;
  trustedCertificates: Record<Server['url'], Certificate['fingerprint']>;
  notTrustedCertificates: Record<Server['url'], Certificate['fingerprint']>;
};

type PersistableValues_3_1_0 = Omit<
  PersistableValues_0_0_0,
  'currentServerUrl' | 'currentView'
> & {
  currentView?:
    | Exclude<PersistableValues_0_0_0['currentView'], null>
    | { url: string }
    | 'downloads'
    | 'settings';
  downloads?: Record<Download['itemId'], Download>;
};
type PersistableValues_3_5_0 = PersistableValues_3_1_0 & {
  isReportEnabled: boolean;
  isFlashFrameEnabled: boolean;
  isInternalVideoChatWindowEnabled: boolean;
};

type PersistableValues_3_7_9 = PersistableValues_3_5_0 & {
  isMinimizeOnCloseEnabled: boolean;
};

type PersistableValues_3_8_1 = PersistableValues_3_7_9 & {
  isReportEnabled: boolean;
};

type PersistableValues_3_8_4 = PersistableValues_3_8_1 & {
  isInternalVideoChatWindowEnabled: boolean;
  isAddNewServersEnabled: boolean;
};

export type PersistableValues = Pick<
  PersistableValues_3_5_0,
  keyof PersistableValues_3_5_0
>;

export const migrations = {
  '>=3.1.0': (before: PersistableValues_0_0_0): PersistableValues_3_1_0 => {
    const { currentServerUrl, ...rest } = before;

    return {
      ...rest,
      currentView: currentServerUrl
        ? { url: currentServerUrl }
        : rest.currentView ?? 'add-new-server',
      downloads: {},
    };
  },
  '>=3.5.0': (before: PersistableValues_3_1_0): PersistableValues_3_5_0 => ({
    ...before,
    isReportEnabled: true,
    isInternalVideoChatWindowEnabled: true,
    isFlashFrameEnabled:
      process.platform === 'win32' || process.platform === 'darwin',
  }),
  '>=3.7.9': (before: PersistableValues_3_5_0): PersistableValues_3_7_9 => ({
    ...before,
    isMinimizeOnCloseEnabled: process.platform === 'win32',
  }),
  '>=3.8.0': (before: PersistableValues_3_7_9): PersistableValues_3_8_1 => ({
    ...before,
    isReportEnabled: !process.mas,
  }),
  '>=3.8.4': (before: PersistableValues_3_8_1): PersistableValues_3_8_4 => ({
    ...before,
    isInternalVideoChatWindowEnabled: !process.mas,
    isAddNewServersEnabled: true,
  }),
};
