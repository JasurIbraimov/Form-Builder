"use client";

import { useTheme } from "next-themes";
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { LuMonitor, LuMoon, LuSunDim } from "react-icons/lu";

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const onThemeChanged = (value: string) => {
    setTheme(value);
  };
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Tabs onValueChange={onThemeChanged} value={theme}>
      <TabsList className="border">
        <TabsTrigger className="p-2" value="light">
          <LuSunDim className="h-[1.2rem] w-[1.2rem]" />
        </TabsTrigger>
        <TabsTrigger className="p-2" value="dark">
          <LuMoon className="h-[1.2rem] w-[1.2rem] rotate-90 transition-all dark:rotate-0" />
        </TabsTrigger>
        <TabsTrigger className="p-2" value="system">
          <LuMonitor className="h-[1.2rem] w-[1.2rem]" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export default ThemeSwitcher;
