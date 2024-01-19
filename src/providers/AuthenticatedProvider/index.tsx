"use client";

import {
  ADAPTER_EVENTS,
  UserInfo,
  WALLET_ADAPTERS,
  WEB3AUTH_NETWORK,
} from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Wallet } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CHAIN_CONFIG } from "./chainConfig";
import { authenticatedInContext } from "./constants";

type Props = Pick<React.ComponentPropsWithoutRef<"div">, "children">;

export default function AuthenticatedProvider({ children }: Props) {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [wallet, setWallet] = useState<Wallet>();
  const [privateKey, setPrivateKey] = useState<string>();

  useEffect(() => {
    const getWallet = async (web3auth: Web3Auth) => {
      try {
        const privateKey = await web3auth!.provider!.request({
          method: "eth_private_key",
        });
        setPrivateKey(privateKey as string);
        console.log("test-web3auth privateKey", privateKey);
        const wallet = new Wallet(privateKey as string);
        setWallet(wallet);
        console.log("test-web3auth wallet", wallet);
      } catch (e) {
        //
      }
    };

    const getUserInfo = async (web3auth: Web3Auth) => {
      const user = await web3auth.getUserInfo();
      console.log("getUserInfo", user);
    };

    const subscribeAuthEvents = async (web3auth: Web3Auth) => {
      // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS
      web3auth.on(ADAPTER_EVENTS.CONNECTED, async () => {
        getUserInfo(web3auth);
        getWallet(web3auth);
      });

      web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {});

      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {});

      web3auth.on(ADAPTER_EVENTS.ERRORED, (error: unknown) => {});

      web3auth.on(ADAPTER_EVENTS.ADAPTER_DATA_UPDATED, () => {});

      web3auth.on(ADAPTER_EVENTS.CACHE_CLEAR, () => {});

      web3auth.on(ADAPTER_EVENTS.NOT_READY, () => {});

      web3auth.on(ADAPTER_EVENTS.READY, () => {});
    };

    async function init() {
      try {
        const clientId = "";
        const web3AuthInstance = new Web3Auth({
          chainConfig: CHAIN_CONFIG.mainnet,
          web3AuthNetwork: "sapphire_mainnet",
          clientId: clientId,
          uiConfig: {
            loginMethodsOrder: ["twitter"],
            appName: "Bitcoin Arcade",
            logoLight:
              "https://storage.googleapis.com/tc-cdn-prod/game-hub/app/logo_app.svg",
            logoDark:
              "https://storage.googleapis.com/tc-cdn-prod/game-hub/app/logo_app.svg",
          },
          sessionTime: 86400 * 7,
          enableLogging: true,
        });

        const adapter = new OpenloginAdapter({
          adapterSettings: {
            network: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
            clientId: clientId,
            uxMode: "redirect",
            redirectUrl: window.location.href,
          },
        });

        web3AuthInstance.configureAdapter(adapter);
        subscribeAuthEvents(web3AuthInstance);
        setWeb3Auth(web3AuthInstance);

        await web3AuthInstance.initModal({
          modalConfig: {
            // Disable Wallet Connect V2
            [WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
              label: "wallet_connect",
              showOnModal: false,
            },
            // Disable Metamask
            [WALLET_ADAPTERS.METAMASK]: {
              label: "metamask",
              showOnModal: false,
            },
            [WALLET_ADAPTERS.TORUS_SOLANA]: {
              label: "torus",
              showOnModal: false,
            },
            [WALLET_ADAPTERS.PHANTOM]: {
              label: "phantom",
              showOnModal: false,
            },
            [WALLET_ADAPTERS.SOLFLARE]: {
              label: "solfare",
              showOnModal: false,
            },
            [WALLET_ADAPTERS.SLOPE]: {
              label: "slope",
              showOnModal: false,
            },
            [WALLET_ADAPTERS.TORUS_EVM]: {
              label: "torus",
              showOnModal: false,
            },
            [WALLET_ADAPTERS.COINBASE]: {
              label: "coinbase",
              showOnModal: false,
            },
            [WALLET_ADAPTERS.OPENLOGIN]: {
              label: "openlogin",
              loginMethods: {
                twitter: {
                  name: "twitter",
                  mainOption: true,
                },
                google: {
                  name: "google",
                  showOnModal: false,
                },
                facebook: {
                  name: "facebook",
                  showOnModal: false,
                },
                reddit: {
                  name: "reddit",
                  showOnModal: false,
                },
                discord: {
                  name: "discord",
                  showOnModal: false,
                },
                twitch: {
                  name: "twitch",
                  showOnModal: false,
                },
                apple: {
                  name: "apple",
                  showOnModal: false,
                },
                line: {
                  name: "line",
                  showOnModal: false,
                },
                github: {
                  name: "github",
                  showOnModal: false,
                },
                linkedin: {
                  name: "linkedin",
                  showOnModal: false,
                },
                weibo: {
                  name: "weibo",
                  showOnModal: false,
                },
                wechat: {
                  name: "wechat",
                  showOnModal: false,
                },
                email_passwordless: {
                  name: "email_passwordless",
                  showOnModal: false,
                },
                sms_passwordless: {
                  name: "sms_passwordless",
                  showOnModal: false,
                },
                kakao: {
                  name: "kakao",
                  showOnModal: false,
                },
              },
            },
          },
        });
      } catch (error) {
      } finally {
      }
    }

    init();
  }, []);

  const login = useCallback(async () => {
    if (!web3Auth) {
      //
      return;
    }
    await web3Auth.connect();
  }, [web3Auth]);

  const logout = useCallback(async () => {
    if (!web3Auth) {
      return;
    }
    await web3Auth.logout();
  }, [web3Auth]);

  const value = useMemo(
    () => ({
      wallet,
      privateKey,
      login,
      logout,
    }),
    [wallet, privateKey, login, logout]
  );

  return (
    <authenticatedInContext.Provider value={value}>
      {children}
    </authenticatedInContext.Provider>
  );
}
