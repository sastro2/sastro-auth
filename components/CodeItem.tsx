import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { AuthCode } from './screens/AuthCodes';

type CodeProps = {
  code: AuthCode;
};

type TotpResponseBody =
  | { errors: { message: string }[] }
  | { password: number };

let currentDate: number;

export default function CodeItem(props: CodeProps) {
  const [password, setPassword] = useState<number>();
  const [errors, setErrors] = useState<{ message: string }[]>();
  const [showCode, setShowCode] = useState<boolean>(false);
  const [countdownDuration, setCountdownDuration] = useState<number>();
  const [refreshCountdown, setRefreshCountdown] = useState<number>(0);

  console.log(password, showCode, countdownDuration);

  const setCurrentDate = () => {
    currentDate = Math.floor(Date.now() / 1000);
  };

  const getPassword = async () => {
    setCurrentDate();

    const totpResponse = await fetch('https://sastro-password.herokuapp.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        twoFaSecret: props.code.seed,
        twoFaUnixT0: props.code.twoFaUnixT0,
        currentTimeInUnix: currentDate,
        applicationPassword: 'KaPdSgVkYp3s6v9y$B&E)H@MbQeThWmZ',
      }),
    });

    const totpResponseBody = (await totpResponse.json()) as TotpResponseBody;

    if ('password' in totpResponseBody) {
      setPassword(totpResponseBody.password);
      setCountdownDuration(
        (Math.floor((currentDate - props.code.twoFaUnixT0) / 30) + 1) * 30 -
          (currentDate - props.code.twoFaUnixT0) +
          1,
      );
      setRefreshCountdown(refreshCountdown + 1);
    }

    if ('errors' in totpResponseBody) {
      setErrors(totpResponseBody.errors);
    }
  };

  if (!password) {
    getPassword();
  }

  if (password && countdownDuration) {
    return (
      <View style={{ marginBottom: '5%', height: 80 }}>
        {showCode ? (
          <View>
            <Text>{props.code.name}</Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 50 }}>{password}</Text>
              <CountdownCircleTimer
                key={refreshCountdown}
                isPlaying
                duration={30}
                initialRemainingTime={countdownDuration}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[7, 5, 2, 0]}
                size={60}
                onComplete={() => {
                  getPassword();
                }}
              >
                {({ remainingTime }) => <Text>{remainingTime}</Text>}
              </CountdownCircleTimer>
            </View>
          </View>
        ) : (
          <View>
            <Text>{props.code.name}</Text>
            <Button
              title="Show Code"
              onPress={() => setShowCode(true)}
            ></Button>
          </View>
        )}
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({});
