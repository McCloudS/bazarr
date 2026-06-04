import { FunctionComponent, useCallback, useState } from "react";
import { Anchor, Button } from "@mantine/core";
import api from "@/apis/raw";
import {
  CollapseBox,
  Layout,
  Message,
  Password,
  Section,
  Selector,
  Text,
} from "@/pages/Settings/components";
import { useSettingValue } from "@/pages/Settings/utilities/hooks";
import { antiCaptchaOption } from "@/pages/Settings/Providers/options";
import { ProviderView } from "./components";
import { IntegrationList, ProviderList } from "./list";

const FlareSolverrTestButton: FunctionComponent = () => {
  const [label, setLabel] = useState("Test");
  const [color, setColor] = useState<string | undefined>(undefined);
  const url = useSettingValue<string>("settings-flaresolverr-url");

  const click = useCallback(() => {
    if (!url) return;
    setLabel("Testing...");
    api.system
      .testFlareSolverr(url.replace(/\/$/, ""))
      .then((result) => {
        if (result.status) {
          setLabel(`OK: ${result.version}`);
          setColor("green");
        } else {
          setLabel(result.error ?? "Failed");
          setColor("red");
        }
      })
      .catch(() => {
        setLabel("Unreachable");
        setColor("red");
      });
  }, [url]);

  return (
    <Button size="xs" color={color} onClick={click}>
      {label}
    </Button>
  );
};

const SettingsProvidersView: FunctionComponent = () => {
  return (
    <Layout name="Providers">
      <Section header="Enabled Providers">
        <ProviderView
          availableOptions={ProviderList}
          settingsKey="settings-general-enabled_providers"
        ></ProviderView>
      </Section>
      <Section header="FlareSolverr">
        <Text
          label="FlareSolverr URL"
          settingKey="settings-flaresolverr-url"
          placeholder="http://flaresolverr:8191"
        ></Text>
        <FlareSolverrTestButton />
        <Message>
          Optional. Bypasses Cloudflare protection for subtitle providers. Works
          independently of the anti-captcha setting below.
        </Message>
      </Section>
      <Section header="Anti-Captcha Options">
        <Selector
          clearable
          label={"Choose the anti-captcha provider you want to use"}
          placeholder="Select a provider"
          settingKey="settings-general-anti_captcha_provider"
          options={antiCaptchaOption}
        ></Selector>
        <Message>Used by providers that have their own captcha (e.g. Addic7ed, Subs4Series)</Message>
        <CollapseBox
          settingKey="settings-general-anti_captcha_provider"
          on={(value) => value === "anti-captcha"}
        >
          <Text
            label="Account Key"
            settingKey="settings-anticaptcha-anti_captcha_key"
          ></Text>
          <Anchor href="http://getcaptchasolution.com/eixxo1rsnw">
            Anti-Captcha.com
          </Anchor>
          <Message>Link to subscribe</Message>
        </CollapseBox>
        <CollapseBox
          settingKey="settings-general-anti_captcha_provider"
          on={(value) => value === "death-by-captcha"}
        >
          <Text
            label="Username"
            settingKey="settings-deathbycaptcha-username"
          ></Text>
          <Password
            label="Password"
            settingKey="settings-deathbycaptcha-password"
          ></Password>
          <Anchor href="https://www.deathbycaptcha.com">
            DeathByCaptcha.com
          </Anchor>
          <Message>Link to subscribe</Message>
        </CollapseBox>
      </Section>
      <Section header="Integrations">
        <ProviderView
          availableOptions={IntegrationList}
          settingsKey="settings-general-enabled_integrations"
        ></ProviderView>
      </Section>
    </Layout>
  );
};

export default SettingsProvidersView;
