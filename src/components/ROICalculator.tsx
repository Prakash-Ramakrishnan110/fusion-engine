import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, DollarSign, Clock, Users } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const ROICalculator = () => {
  const [employees, setEmployees] = useState([50]);
  const [hoursPerWeek, setHoursPerWeek] = useState([10]);

  // Dummy calculation logic
  const costPerHour = 50; 
  const currentCost = employees[0] * hoursPerWeek[0] * costPerHour * 52;
  // Assume our solution saves 40% of time
  const timeSaved = currentCost * 0.4;
  const annualSavings = Math.round(timeSaved);

  return (
    <div className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Calculate Your ROI</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See how much time and money you can save by switching to our optimized engineering and startup workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 bg-muted/30 rounded-3xl p-6 md:p-10 border border-border">
          {/* Inputs */}
          <div className="space-y-10">
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="font-semibold flex items-center gap-2">
                  <Users size={18} className="text-primary"/> Team Size
                </label>
                <span className="font-bold text-xl">{employees[0]}</span>
              </div>
              <Slider 
                defaultValue={[50]} 
                max={500} 
                min={5} 
                step={5} 
                onValueChange={setEmployees}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">Number of employees using the system</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="font-semibold flex items-center gap-2">
                  <Clock size={18} className="text-primary"/> Hours Spent
                </label>
                <span className="font-bold text-xl">{hoursPerWeek[0]}h/week</span>
              </div>
              <Slider 
                defaultValue={[10]} 
                max={40} 
                min={1} 
                step={1} 
                onValueChange={setHoursPerWeek}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">Time spent on manual processes per employee</p>
            </div>
          </div>

          {/* Outputs */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Calculator size={100} />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-lg font-semibold mb-2">Estimated Annual Savings</h3>
              <motion.div 
                key={annualSavings}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl md:text-5xl font-bold text-primary mb-6 flex items-center gap-1"
              >
                <DollarSign size={40} />
                {annualSavings.toLocaleString()}
              </motion.div>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <CheckIcon /> Payback period of less than 3 months
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon /> Reduces manual workload by 40%
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon /> Boosts overall team productivity
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  </div>
);

export default ROICalculator;
