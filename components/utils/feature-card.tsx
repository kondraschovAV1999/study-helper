// This component is used to display a feature card with an icon, title, and a list of features.
// It is used in the landing page to showcase the features of the app.
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { ReactNode } from "react";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  features: string[];
};

export function FeatureCard({ icon, title, features }: FeatureCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full">
      <CardHeader>
        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4 mx-auto">
          {icon}
        </div>
        <h3 className="text-2xl font-semibold text-center">{title}</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
            <p>{feature}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}