import { Card, CardDescription, CardTitle } from "./ui/card";

type WeatherDetailProps = {
    name: string;
    description: string;
    children?: React.ReactNode;
}

export default function WeatherDetail({ name, description, children }: WeatherDetailProps) {
  return (
    <Card title={name} className="w-fit p-1.5">
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      {children}
    </Card>
  )
}