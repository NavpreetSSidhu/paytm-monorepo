import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import React, { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";

const SendCard = () => {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <div className="h-[90vh]">
      <Center>
        <Card title="Send">
          <div className="min-w-72 pt-2">
            <TextInput
              placeholder={"Number"}
              label="Number"
              onChange={(val) => {
                setNumber(val);
              }}
            />
            <TextInput
              placeholder={"Amount"}
              label="Amount"
              onChange={(val) => {
                setAmount(val);
              }}
            />
            <div className="flex justify-center pt-4">
              <Button
                onClick={async () => {
                  await p2pTransfer(number, Number(amount) * 100);
                }}
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
      </Center>
    </div>
  );
};

export default SendCard;
